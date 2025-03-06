// controllers/downloadDocx.js
const fs = require("fs");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const ImageModule = require("docxtemplater-image-module-free");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");

Chart.register(...registerables);

/** Create the same demo chart as base64 PNG. */
function createDemoChartBase64() {
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
}

/**
 * Create a DOCX from the given 'report' data.
 * Returns a Node buffer containing the .docx
 */
async function createDocx(report) {
    // 1. Load the DOCX template
    const templatePath = path.resolve(__dirname, "../views/template.docx");
    const templateContent = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(templateContent);

    // 2. Configure image module for base64 images
    const imageModule = new ImageModule({
        centered: false,
        getImage: (base64) => Buffer.from(base64, "base64"),
        getSize: () => [600, 300],
    });

    // 3. Instantiate Docxtemplater
    const doc = new Docxtemplater(zip, {
        modules: [imageModule],
        paragraphLoop: true,
        linebreaks: true,
    });

    // 4. Generate a demo chart (if you need it)
    const demoChartBase64 = createDemoChartBase64();

    // 5. Prepare your template data (matching placeholders in .docx)
    const templateData = {
        primary_key: report.primaryKey || "",
        date: report.date || "",
        force_name: report.battalionName || "",
        manager: report.mentorName || "",
        exercise_manager: report.exerciseManagerName || "",
        map: report.map || "",
        mission: report.mission || "",
        scenario_1: report.data?.scenarios?.scenario1?.scenarioText || "",
        scenario_2: report.data?.scenarios?.scenario2?.scenarioText || "",
        demo_chart: demoChartBase64,
    };

    // 6. Render the template
    doc.render(templateData);

    // 7. Generate final DOCX as node buffer
    const docxBuf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    return docxBuf;
}

module.exports = createDocx;
