const Rating = require('../models/rating.model');

const sampleRatings = [
    {
        cakeId: "6a76fbd76c295ef020200f5f",
        customerName: "Alice Smith",
        ratingScore: 5,
        comment: "Absolutely delicious! Rich chocolate flavor."
    },
    {
        cakeId: "6a76fbd76c295ef020200f5f",
        customerName: "Bob Johnson",
        ratingScore: 4,
        comment: "Great cake, perfect sweetness."
    },
    {
        cakeId: "6a76fbd76c295ef020200f60",
        customerName: "Clara Oswald",
        ratingScore: 5,
        comment: "The red velvet cream cheese frosting is divine!"
    }
];

const seedRatingsIfEmpty = async () => {
    try {
        const count = await Rating.countDocuments();
        if (count === 0) {
            await Rating.insertMany(sampleRatings);
            console.log("[Rating Service] Sample ratings seeded successfully!");
        }
    } catch (error) {
        console.error("[Rating Seed Error]:", error.message);
    }
};

module.exports = seedRatingsIfEmpty;
