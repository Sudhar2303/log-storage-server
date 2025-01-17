const express = require('express')
const router = express.Router()

const { handleLogReq} =require('../controllers/logController')

router.post('/', handleLogReq )

module.exports = router