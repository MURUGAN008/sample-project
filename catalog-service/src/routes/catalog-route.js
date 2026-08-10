const express = require("express");
const route = express.Router();
const {
    getAllCakes,
    getCakeById,
    createCake,
    updateCake,
    deleteCake
} = require("../controllers/catalog-controller");

route.get("/cakes", getAllCakes);
route.get("/cakes/:id", getCakeById);
route.post("/cakes", createCake);
route.put("/cakes/:id", updateCake);
route.delete("/cakes/:id", deleteCake);

module.exports = route;

