const { storeLogAsBuffer } = require('../services/bufferService')

const handleLogReq = async(request, response) => {
    const logData = request.body; 
    
    try {
        await storeLogAsBuffer(logData);
        response.status(200).json({ message: 'Log received and buffered' });
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
}

module.exports = {
    handleLogReq
}