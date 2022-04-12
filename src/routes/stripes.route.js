const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripes.controller')



router.post('/create-session', stripeController.createSession)
router.get('/createIntent/:id', stripeController.createIntent)
router.get('/getCard', stripeController.getCard)



module.exports = router;