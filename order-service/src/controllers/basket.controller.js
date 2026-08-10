const Basket = require('../models/basket.model');

// Helper to recalculate total amount
const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// GET /api/basket/:customerId - Retrieve basket
const getBasket = async (req, res) => {
    try {
        const { customerId } = req.params;
        let basket = await Basket.findOne({ customerId });

        if (!basket) {
            basket = await Basket.create({ customerId, items: [], totalAmount: 0 });
        }

        return res.status(200).json({ success: true, data: basket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// POST /api/basket/items - Add or update item in basket
const addItemToBasket = async (req, res) => {
    try {
        const { customerId, cakeId, name, price, quantity } = req.body;

        if (!customerId || !cakeId || !name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing: customerId, cakeId, name, price"
            });
        }

        const qtyToAdd = Number(quantity) || 1;
        let basket = await Basket.findOne({ customerId });

        if (!basket) {
            basket = new Basket({
                customerId,
                items: [{ cakeId, name, price: Number(price), quantity: qtyToAdd }],
                totalAmount: Number(price) * qtyToAdd
            });
        } else {
            const existingItemIndex = basket.items.findIndex(item => item.cakeId === cakeId);
            if (existingItemIndex > -1) {
                basket.items[existingItemIndex].quantity += qtyToAdd;
            } else {
                basket.items.push({ cakeId, name, price: Number(price), quantity: qtyToAdd });
            }
            basket.totalAmount = calculateTotal(basket.items);
            basket.updatedAt = new Date();
        }

        await basket.save();
        return res.status(200).json({ success: true, data: basket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// DELETE /api/basket/items/:customerId/:cakeId - Remove item from basket
const removeItemFromBasket = async (req, res) => {
    try {
        const { customerId, cakeId } = req.params;
        let basket = await Basket.findOne({ customerId });

        if (!basket) {
            return res.status(404).json({ success: false, message: "Basket not found" });
        }

        basket.items = basket.items.filter(item => item.cakeId !== cakeId);
        basket.totalAmount = calculateTotal(basket.items);
        basket.updatedAt = new Date();

        await basket.save();
        return res.status(200).json({ success: true, data: basket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getBasket,
    addItemToBasket,
    removeItemFromBasket
};
