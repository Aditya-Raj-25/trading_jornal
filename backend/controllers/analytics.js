const AnalyticsService = require('../services/AnalyticsService');
const AnalyticsFacade = require('../facades/AnalyticsFacade');

class AnalyticsController {
    async getSummary(req, res) {
        try {
            const summary = await AnalyticsService.getSummary(req.user.id);
            res.json(summary);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getInsights(req, res) {
        try {
            const insights = await AnalyticsService.getInsights(req.user.id);
            res.json(insights);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getFullReport(req, res) {
        try {
            const format = req.query.format || 'PDF';
            const report = await AnalyticsFacade.getFullAnalyticsReport(req.user.id, format);
            res.json({
                message: `Report generated in ${format} format`,
                metadata: report.metadata,
                // In a real app we'd stream the reportFile buffer here
                fileSize: report.reportFile.length
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new AnalyticsController();
