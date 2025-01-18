const { uploadLogsToS3 } = require('../services/s3Service')
const MAX_BUFFER_SIZE = 10 * 1024 * 1024
const FLUSH_INTERVAL = 60000

let logBuffer = []
let bufferSize = 0

const storeLogAsBuffer = async(logData)=>{

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
}

const flushBuffer = async () => {
    if (logBuffer.length === 0) return; 

    const logsToFlush = [...logBuffer];
    logBuffer = [];
    bufferSize = 0;

    await uploadLogsToS3(logsToFlush);
};

setInterval(() => {
    flushBuffer().catch((err) => console.error('Error flushing logs:', err));
}, FLUSH_INTERVAL);

module.exports ={
    storeLogAsBuffer
}