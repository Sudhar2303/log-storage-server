require('@aws-sdk/crc64-nvme-crt');  
const { PutObjectCommand} = require('@aws-sdk/client-s3')

const s3Client = require('../configurations/s3config')

const uploadLogsToS3 = async (logs) => {
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const indianTime = new Date().toLocaleString('en-US', options).replace(/[/, :]/g, '-');
    const fileName = `log-${indianTime}.json`;

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: JSON.stringify(logs),
        ContentType: 'application/json',
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        
    } catch (error) {

        throw error;
    }
};
  
module.exports = {
    uploadLogsToS3
}