require('@aws-sdk/crc64-nvme-crt');  

const { GetObjectCommand , PutObjectCommand} = require('@aws-sdk/client-s3')
const { Readable } = require('stream')

const s3Client = require('../configurations/s3config')

const getObjectFromS3 = async() => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: process.env.BUCKET_FILE_NAME,
    };
  
    try {
        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);
    
        const stream = data.Body;
        if (!(stream instanceof Readable)) {
          throw new Error("Expected data.Body to be a Readable stream");
        }
    
        let fileContent = "";
        for await (const chunk of stream) {
          fileContent += chunk.toString(); 
        }
        return fileContent;
    }
    catch (err) {
        throw new Error(`Error retrieving file: ${err.message}`);
    }
}

const uploadJsonToS3 = async (jsonData) => {
  const fileName = `log--${new Date().toISOString()}.json`;

  const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: JSON.stringify(jsonData), 
      ContentType: 'application/json',
  };

  try {
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      
      return data;
  } catch (error) {
      
      throw error;
  }
};
  
module.exports = {
    getObjectFromS3,
    uploadJsonToS3
}