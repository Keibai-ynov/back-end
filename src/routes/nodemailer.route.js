const express = require('express');
const router = express.Router();
const nodemailerController = require('../controllers/nodemailer.controller')



router.post('/sendMail', nodemailerController.sendMail)



module.exports = router;