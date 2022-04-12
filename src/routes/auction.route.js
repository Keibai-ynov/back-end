const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auction.controller')

router.get('/auctions', auctionController.getAuctions)
router.get('/auction/:id', auctionController.getAuction)
router.post('/auction', auctionController.createAuction)
router.put('/auction/:id', auctionController.updateAuction)
router.delete('/auction/:id', auctionController.deleteAuction)
router.delete('/auctions', auctionController.deleteAuctions)

router.post('/auctions/filter', auctionController.getFilteredAuctions)

module.exports = router