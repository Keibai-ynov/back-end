const express = require('./src/services/express.service')
const mongoose = require('./src/services/mongoose.service')
const cron = require('./src/cron/auction.cron')

cron.Task.start()


require('dotenv').config();

express.start()
mongoose.connect()