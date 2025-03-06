// server/controllers/downloadDocxController.js
const Report = require('../models/Report');
const createDocx = require('./downloadDocx'); // your existing utility

const downloadDocxController = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // 1) Generate the DOCX buffer
        const docxBuf = await createDocx(report);

        // 2) Name the file from the primaryKey (fallback to the _id)
        const fileBaseName = report.primaryKey || reportId;
        const outputFileName = fileBaseName + ".docx";

        // 3) Set headers for DOCX download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${outputFileName}"`);

        // 4) Send the buffer
        return res.send(docxBuf);

    } catch (error) {
        console.error("Error generating DOCX report:", error);
        return res.status(500).json({ message: "Error generating DOCX" });
    }
};

module.exports = downloadDocxController;
