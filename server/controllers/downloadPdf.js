const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");
Chart.register(...registerables);

/**
 * Helper: Parse grade from various types:
 * - If grade is an object with $numberDouble, return its parsed value.
 * - If grade is a string, parse it as a float.
 * - If grade is a number, return it.
 */
function parseGrade(grade, fallback = 0) {
    if (typeof grade === "object" && grade.$numberDouble) {
        return parseFloat(grade.$numberDouble);
    }
    if (typeof grade === "string") {
        const parsed = parseFloat(grade);
        return isNaN(parsed) ? fallback : parsed;
    }
    return typeof grade === "number" ? grade : fallback;
}

/**
 * Draw the watermark on the current page.
 */
function drawWatermark(doc, bgImagePath) {
    if (fs.existsSync(bgImagePath)) {
        // Set a low opacity for the watermark
        doc.opacity(0.2);
        doc.image(bgImagePath, 0, 0, {
            width: doc.page.width,
            height: doc.page.height,
        });
        doc.opacity(1);
    }
}

/**
 * Draw the header on the current page.
 */
function drawHeader(doc) {
    const headerText = "-שמור-";
    // Draw header at the top center using the registered Hebrew font.
    doc.font("Hebrew")
        .fontSize(10)
        .text(headerText, doc.page.margins.left, 15, {
            width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
            align: "center"
        });
}

/**
 * Create a single bar chart (PNG buffer) for a part’s grade versus a fixed pass grade.
 * The part’s grade is normalized (multiplied by 3) before being drawn.
 */
function createPartChart(normalizedGrade, label) {
    const passGrade = 60;
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [`ציון חלק ${label}`, "ציון ממוצע"],
            datasets: [
                {
                    label: "ציון הכוח",
                    data: [normalizedGrade, passGrade],
                    backgroundColor: [
                        "rgba(136,132,216,0.6)",
                        "rgba(130,202,157,0.6)",
                    ],
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `ציון חלק ${label}: ${normalizedGrade.toFixed(2)}`,
                },
                tooltip: { enabled: false },
            },
            scales: {
                y: { min: 0, max: 100 },
            },
            // Draw labels on each bar after the animation completes.
            animation: {
                onComplete: function() {
                    const chartInstance = this.chart;
                    const ctx = chartInstance.ctx;
                    ctx.font = "bold 16px Arial";
                    ctx.fillStyle = "black";
                    chartInstance.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chartInstance.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            // Use the tooltipPosition method for a safe label position.
                            const pos = bar.tooltipPosition();
                            ctx.fillText(dataset.data[index], pos.x, pos.y - 10);
                        });
                    });
                }
            }
        }
    });
    return canvas.toBuffer("image/png");
}

/**
 * Create a PDF from the given report data.
 */
function createPdf(report) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
            layout: "portrait",
        });

        // Register Hebrew font immediately after creating the document.
        const fontPath = path.resolve("assets", "fonts", "NotoSansHebrew-Regular.ttf");
        if (!fs.existsSync(fontPath)) {
            return reject(new Error(`Font file not found at path: ${fontPath}`));
        }
        doc.registerFont("Hebrew", fontPath);

        const bgImagePath = path.resolve("views", "dca_logo.png");

        // Draw watermark and header on the first page.
        drawWatermark(doc, bgImagePath);
        drawHeader(doc);

        // For each new page, add the watermark and header.
        doc.on("pageAdded", () => {
            drawWatermark(doc, bgImagePath);
            drawHeader(doc);
        });

        const buffers = [];
        doc.on("data", (data) => buffers.push(data));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        // ---- Draw Title and Data Fields (New Template)
        // Title Section
        doc.font("Hebrew")
            .fontSize(26)
            .text("DCA", { align: "center" })
            .moveDown();
        doc.font("Hebrew")
            .fontSize(18)
            .text("דוח סיכום אימון", { align: "center" })
            .moveDown();

        // Data Template
        doc.fontSize(12)
            .text(`תאריך: ${report.date || ""}`, { align: "right" })
            .moveDown(0.5);
        doc.fontSize(12)
            .text(`מיקום: ${report.map || ""}`, { align: "right" })
            .moveDown(0.5);
        doc.fontSize(12)
            .text(`שם מפקד הכוח: `, { align: "right" })
            .moveDown(0.5);
        doc.fontSize(12)
            .text(`שם מנהל התרגיל: ${report.exerciseManagerName || ""}`, { align: "right" })
            .moveDown(0.5);
        doc.fontSize(12)
            .text(`שם חונך: ${report.mentorName || ""}`, { align: "right" })
            .moveDown(1);

        // ---- Draw Scenarios
        doc.fontSize(14).text("תרחיש ראשון:", { align: "right" });
        doc.fontSize(12).text(report.data?.scenarios?.scenario1?.scenarioText || "", { align: "right" });
        doc.moveDown();

        doc.fontSize(14).text("תרחיש שני:", { align: "right" });
        doc.fontSize(12).text(report.data?.scenarios?.scenario2?.scenarioText || "", { align: "right" });
        doc.moveDown();

        // ---- Create Charts for Grade 1
        const grade1Parts = report.data?.grades?.grade1?.scoreData?.parts || [];
        doc.fontSize(14).text("תרשימי חלקים :  (Grade 1)", { align: "right" });
        doc.moveDown(1.5);

        grade1Parts.forEach((part, index) => {
            const rawGrade = parseGrade(part.grade, 0);
            const normalizedGrade = rawGrade * 3;
            const chartBuffer = createPartChart(normalizedGrade, index + 1);
            // Insert chart with a fixed size.
            doc.image(chartBuffer, { width: 300, height: 200, align: "center" });
            // Extra vertical space between graphs.
            doc.moveDown(3);
        });

        // ---- New Page for Grade 2
        doc.addPage();
        doc.fontSize(14).text("תרשימי חלקים (Grade 2):", { align: "right" });
        doc.moveDown(1.5);

        const grade2Parts = report.data?.grades?.grade2?.scoreData?.parts || [];
        grade2Parts.forEach((part, index) => {
            const rawGrade = parseGrade(part.grade, 0);
            const normalizedGrade = rawGrade * 3;
            const chartBuffer = createPartChart(normalizedGrade, index + 1);
            doc.image(chartBuffer, { width: 300, height: 200, align: "center" });
            doc.moveDown(3);
        });

        doc.end();
    });
}

module.exports = createPdf;
