const Rating = require('../models/rating.model');

// POST /api/ratings - Submit a new rating & review
const submitRating = async (req, res) => {
    try {
        const { cakeId, customerName, ratingScore, comment } = req.body;

        if (!cakeId || !customerName || ratingScore === undefined) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing: cakeId, customerName, ratingScore"
            });
        }

        if (ratingScore < 1 || ratingScore > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating score must be between 1 and 5"
            });
        }

        const rating = await Rating.create({
            cakeId,
            customerName,
            ratingScore: Number(ratingScore),
            comment
        });

        return res.status(201).json({
            success: true,
            data: rating
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// GET /api/ratings/cake/:cakeId - Get all ratings for a cake
const getCakeRatings = async (req, res) => {
    try {
        const { cakeId } = req.params;
        const ratings = await Rating.find({ cakeId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: ratings.length,
            data: ratings
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// GET /api/ratings/cake/:cakeId/summary - Get aggregate average rating & total review count
const getCakeRatingSummary = async (req, res) => {
    try {
        const { cakeId } = req.params;

        const summary = await Rating.aggregate([
            { $match: { cakeId } },
            {
                $group: {
                    _id: "$cakeId",
                    averageRating: { $avg: "$ratingScore" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (summary.length === 0) {
            return res.status(200).json({
                success: true,
                cakeId,
                averageRating: 0,
                totalReviews: 0
            });
        }

        return res.status(200).json({
            success: true,
            cakeId,
            averageRating: Math.round(summary[0].averageRating * 10) / 10,
            totalReviews: summary[0].totalReviews
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    submitRating,
    getCakeRatings,
    getCakeRatingSummary
};
