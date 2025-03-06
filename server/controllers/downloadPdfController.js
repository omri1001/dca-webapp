// server/controllers/downloadPdfController.js
const Report = require('../models/Report');
const createPdf = require('./downloadPdf'); // updated utility using PDFKit

const downloadPdfController = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const pdfBuf = await createPdf(report);
        const fileBaseName = report.primaryKey || reportId;
        const outputFileName = fileBaseName + ".pdf";

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${outputFileName}"`);

        return res.send(pdfBuf);
    } catch (error) {
        console.error("Error generating PDF report:", error);
        return res.status(500).json({ message: "Error generating PDF" });
    }
};

module.exports = downloadPdfController;
