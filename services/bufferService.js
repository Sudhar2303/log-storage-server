const { uploadLogsToS3 } = require('../services/s3Service');
const fs = require('fs');
const path = require('path');

const MAX_BUFFER_SIZE = 10 * 1024 * 1024; 
const FLUSH_INTERVAL = 60000; 
const LOCAL_LOG_FILE = path.join(__dirname, 'failedLogs.json');

if (!fs.existsSync(LOCAL_LOG_FILE)) {
    fs.writeFileSync(LOCAL_LOG_FILE, '[]');
}

let logBuffer = [];
let bufferSize = 0;
let flushingBuffer = [];

const storeLogAsBuffer = async (logData) => {
    const logEntry = {
        timestamp: Math.floor(Date.now() / 1000),
        ...logData,
    };

    const logEntrySize = Buffer.byteLength(JSON.stringify(logEntry));
    logBuffer.push(logEntry);
    bufferSize += logEntrySize;

    if (bufferSize >= MAX_BUFFER_SIZE) {
        await flushBuffer();
    }
};

const flushBuffer = async () => {
    if (logBuffer.length === 0 ) return;

    flushingBuffer = [...logBuffer];
    logBuffer = [];
    bufferSize = 0;

    try {
        let failedLogs = [];

        if (fs.existsSync(LOCAL_LOG_FILE)) {
            const fileData = fs.readFileSync(LOCAL_LOG_FILE, 'utf8').trim();
            if (fileData && fileData !== '[]') {  
                failedLogs = JSON.parse(fileData);
            }
        }

        const combinedLogs = [...failedLogs, ...flushingBuffer];

        if (combinedLogs.length === 0) {
            console.log('No logs to upload.');
            return;
        }

        await uploadLogsToS3(combinedLogs);
        console.log('Logs uploaded successfully');

        if (failedLogs.length > 0) {
            fs.writeFileSync(LOCAL_LOG_FILE, JSON.stringify([], null, 2));
        }
    } catch (error) {
        console.error('Error uploading logs to S3:', error.message);

        try {
            const existingLogs = fs.existsSync(LOCAL_LOG_FILE)
                ? JSON.parse(fs.readFileSync(LOCAL_LOG_FILE, 'utf8'))
                : [];

            const newLogs = [...existingLogs, ...flushingBuffer];

            if (newLogs.length > 0) {
                fs.writeFileSync(LOCAL_LOG_FILE, JSON.stringify(newLogs, null, 2));
                console.log('Logs stored locally for retry');
            }
        } catch (fsError) {
            console.error('Failed to store logs locally:', fsError);
        }
    } finally {
        flushingBuffer = [];
    }
};

setInterval(() => {
    flushBuffer().catch((err) => console.error('Error flushing logs:', err));
}, FLUSH_INTERVAL);

module.exports = {
    storeLogAsBuffer,
};
