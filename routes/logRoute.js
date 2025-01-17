const express = require('express')
const router = express.Router()

const { getLogData, updateLogData } =require('../controllers/logController')

router.get('/',updateLogData )

module.exports = router