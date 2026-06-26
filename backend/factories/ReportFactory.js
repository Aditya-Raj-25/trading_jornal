// Mock implementation of different report generators
class PdfReportGenerator {
    generate(data) {
        console.log('Generating PDF...');
        return Buffer.from(`PDF Report: ${JSON.stringify(data)}`);
    }
}

class CsvReportGenerator {
    generate(data) {
        console.log('Generating CSV...');
        return `CSV Data\n${JSON.stringify(data)}`;
    }
}

class ReportFactory {
    static createReportGenerator(format) {
        switch (format.toUpperCase()) {
            case 'PDF':
                return new PdfReportGenerator();
            case 'CSV':
                return new CsvReportGenerator();
            default:
                throw new Error(`Report format ${format} is not supported.`);
        }
    }
}

module.exports = ReportFactory;
