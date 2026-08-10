const cakeModel = require("../models/Cake");

// GET /api/cakes - List all cakes with optional filters (name, category, minPrice, maxPrice)
const getAllCakes = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const cakes = await cakeModel.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: cakes.length, data: cakes });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
};

// GET /api/cakes/:id - Get single cake details
const getCakeById = async (req, res) => {
    try {
        const cake = await cakeModel.findById(req.params.id);
        if (!cake) {
            return res.status(404).json({ success: false, message: "Cake not found" });
        }
        return res.status(200).json({ success: true, data: cake });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
};

// POST /api/cakes - Create new cake
const createCake = async (req, res) => {
    try {
        const { name, description, price, category, stockQuantity, imageUrl } = req.body;
        if (!name || !description || price === undefined || !category || !imageUrl) {
            return res.status(400).json({ success: false, message: "Required fields missing: name, description, price, category, imageUrl" });
        }
        const cake = await cakeModel.create({
            name,
            description,
            price,
            category,
            stockQuantity: stockQuantity !== undefined ? stockQuantity : 10,
            imageUrl
        });
        return res.status(201).json({ success: true, data: cake });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
};

// PUT /api/cakes/:id - Update existing cake
const updateCake = async (req, res) => {
    try {
        const cake = await cakeModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cake) {
            return res.status(404).json({ success: false, message: "Cake not found" });
        }
        return res.status(200).json({ success: true, data: cake });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
};

// DELETE /api/cakes/:id - Delete cake
const deleteCake = async (req, res) => {
    try {
        const cake = await cakeModel.findByIdAndDelete(req.params.id);
        if (!cake) {
            return res.status(404).json({ success: false, message: "Cake not found" });
        }
        return res.status(200).json({ success: true, message: "Cake deleted successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
};

module.exports = {
    getAllCakes,
    getCakeById,
    createCake,
    updateCake,
    deleteCake
};
