const express = require('express');
const shop = require('../controllers/shop');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/reduce/:bookID', shop.reduceQuantity);

router.get('/inc/:bookID', shop.increaseQuantity);

router.get('/remove/:bookID', shop.remove);

router.post('/checkout/gcash/:userID/(:arr)*', shop.checkoutGcash);

router.post('/checkout/card/:userID/(:arr)*', shop.checkoutCard);

module.exports = router;