// controllers/downloadReport.js
const Report = require("../models/Report");
const createDocx = require("./downloadDocx");
const createPdf = require("./downloadPdf");
const archiver = require("archiver");

const downloadReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // 1) Generate the DOCX buffer
        const docxBuf = await createDocx(report);

        // 2) Generate the PDF buffer
        const pdfBuf = await createPdf(report);

        // 3) We'll zip them so we can send them both in one response
        const primaryKeyOrId = report.primaryKey || reportId;
        const zipFileName = `report_${primaryKeyOrId}.zip`;

        // 4) Set headers for the zip download
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${zipFileName}"`);

        // 5) Create the archiver and pipe to response
        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", (err) => {
            throw err;
        });
        archive.pipe(res);

        // 6) Add the DOCX file to the zip
        archive.append(docxBuf, { name: `report_${primaryKeyOrId}.docx` });

        // 7) Add the PDF file to the zip
        archive.append(pdfBuf, { name: `report_${primaryKeyOrId}.pdf` });

        // 8) Finalize (this will send the .zip to client)
        await archive.finalize();

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report" });
    }
};

module.exports = downloadReport;
