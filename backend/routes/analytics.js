const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AnalyticsController = require('../controllers/analytics');

router.use(auth);

router.get('/summary', AnalyticsController.getSummary.bind(AnalyticsController));
router.get('/insights', AnalyticsController.getInsights.bind(AnalyticsController));
router.get('/report', AnalyticsController.getFullReport.bind(AnalyticsController));

module.exports = router;
