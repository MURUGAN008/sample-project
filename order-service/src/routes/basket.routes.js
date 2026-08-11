const express = require('express');
const router = express.Router();
const {
    getBasket,
    addItemToBasket,
    updateItemQuantity,
    removeItemFromBasket
} = require('../controllers/basket.controller');

router.get('/basket/:customerId', getBasket);
router.post('/basket/items', addItemToBasket);
router.put('/basket/items', updateItemQuantity);
router.delete('/basket/items/:customerId/:cakeId', removeItemFromBasket);

module.exports = router;
