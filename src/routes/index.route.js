const express = require('express')
const router = express.Router()
const userRouter = require('./user.route')
const auctionRouter = require('./auction.route')
const nodemailerRouter = require('./nodemailer.route')
const stripesRouter = require('./stripes.route')

router.use(auctionRouter);
router.use(nodemailerRouter);
router.use(userRouter);
router.use(stripesRouter);

module.exports = router;