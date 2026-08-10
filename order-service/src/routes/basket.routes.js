const express = require('express');
const router = express.Router();
const {
    getBasket,
    addItemToBasket,
    removeItemFromBasket
} = require('../controllers/basket.controller');

router.get('/basket/:customerId', getBasket);
router.post('/basket/items', addItemToBasket);
router.delete('/basket/items/:customerId/:cakeId', removeItemFromBasket);

module.exports = router;
