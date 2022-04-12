const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const verifyToken = require('../middleware/verifyToken')


router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getUserById)
router.get('/favorites/:id', userController.getFavorites)
router.get('/auctions/:id', userController.getAuctions)
router.post('/user', userController.register)
router.post('/user/login', userController.login)
router.put('/favorite/:id', userController.addToFavorites)
router.put('/user/:id', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)
router.delete('/users', userController.deleteUsers)


module.exports = router;