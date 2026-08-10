const express = require('express');
const router = express.Router();
const {
    submitRating,
    getCakeRatings,
    getCakeRatingSummary
} = require('../controllers/rating.controller');

router.post('/ratings', submitRating);
router.get('/ratings/cake/:cakeId', getCakeRatings);
router.get('/ratings/cake/:cakeId/summary', getCakeRatingSummary);

module.exports = router;
