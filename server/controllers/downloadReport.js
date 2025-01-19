// downloadReport.js
const fs = require("fs");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const Report = require("../models/Report");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");
const ImageModule = require("docxtemplater-image-module-free");

Chart.register(...registerables);

/** Create a base64-encoded PNG chart */
const createDemoChartBase64 = () => {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Category A", "Category B", "Category C"],
            datasets: [
                {
                    label: "Demo Data",
                    data: [12, 19, 7],
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Demo Chart" },
            },
        },
    });

    const buffer = canvas.toBuffer("image/png");
    return buffer.toString("base64");
};

const downloadReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // 1. Load the .docx template
        const templatePath = path.resolve(__dirname, "../views/template.docx");
        const templateContent = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(templateContent);

        // 2. Configure docxtemplater-image-module-free for base64
        const imageOptions = {
            centered: false,
            getImage: (tagValue) => Buffer.from(tagValue, "base64"),
            getSize: () => [600, 300],
        };

        const doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOptions)],
            paragraphLoop: true,
            linebreaks: true,
        });

        // 3. Generate the chart as base64
        const demoChartBase64 = createDemoChartBase64();

        // 4. Prepare the data object
        const templateData = {
            primary_key: report.primary_key || "",
            date: report.date || "",
            force_name: report.force_name || "",
            manager: report.manager || "",
            location: report.location || "",
            scenario_1: report.scenarios?.scenario_1 || "",
            scenario_2: report.scenarios?.scenario_2 || "",
            poll_link: report.poll_link || "",
            youtube_link: report.youtube_link || "",
            // The key MUST match the placeholder in the .docx
            demo_chart: demoChartBase64,
        };

        // 5. Render with docxtemplater
        doc.render(templateData);

        // 6. Generate the final DOCX
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        // 7. Send the file as download
        const outputFileName = `report_${report.primary_key}.docx`;
        res.setHeader("Content-Disposition", `attachment; filename=${outputFileName}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(buf);
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report" });
    }
};

module.exports = downloadReport;
