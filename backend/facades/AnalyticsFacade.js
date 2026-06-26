const AnalyticsService = require('../services/AnalyticsService');
const ReportService = require('../services/ReportService');
const ReportFactory = require('../factories/ReportFactory');

/**
 * Facade Pattern: Provides a simplified, higher-level interface for
 * generating comprehensive analytics and reports, hiding the complexity
 * of interacting with multiple underlying subsystems (Services/Factories).
 */
class AnalyticsFacade {
    /**
     * Get a full analytics summary and a generated report in one call.
     */
    async getFullAnalyticsReport(userId, format = 'PDF') {
        // 1. Get raw analytics summary
        const summary = await AnalyticsService.getSummary(userId);
        
        // 2. Get AI Insights (mocked)
        const insights = await AnalyticsService.getInsights(userId);

        // 3. Compose full data object
        const reportData = {
            userId,
            generatedAt: new Date(),
            summary,
            insights
        };

        // 4. Use Factory to get the appropriate report generator
        const generator = ReportFactory.createReportGenerator(format);

        // 5. Generate the physical report
        const reportBuffer = generator.generate(reportData);

        return {
            metadata: reportData,
            reportFile: reportBuffer
        };
    }
}

module.exports = new AnalyticsFacade();
