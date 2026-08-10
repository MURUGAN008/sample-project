require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const catalogRoute = require("./src/routes/catalog-route");
const seedCakesIfEmpty = require("./src/config/seed");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        service: "catalog-service",
        timestamp: new Date()
    });
});

// API routes mounted under /api (e.g., /api/cakes)
app.use("/api", catalogRoute);

connectDB().then(async () => {
    await seedCakesIfEmpty();
    app.listen(PORT, () => {
        console.log(`[Catalog Service] Running on port ${PORT}`);
    });
});


