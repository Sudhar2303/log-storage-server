const fs = require('fs').promises
const { getObjectFromS3, uploadJsonToS3 } = require('../services/s3Service')

const getLogData = async(request,response) =>{
    try 
    {
        const fileContent = await getObjectFromS3();
        
        response.status(200).send({message : " Success"})
    } 
    catch (error) {
        response.status(500).send({message : error.message})
      }
}

const updateLogData = async(request, response) => {
    try {

        const data = await fs.readFile('logDatabase/logData.js', 'utf8')
        let jsonData = JSON.parse(data);
        await uploadJsonToS3(jsonData);

        await fs.writeFile('logDatabase/logData.js', JSON.stringify([], null, 2))

        response.status(200).json({
            message: 'Data processed successfully',
        });
    } catch (error) {
        
        response.status(500).send({ message: error.message })
    }
}

module.exports = {
    getLogData,
    updateLogData
}