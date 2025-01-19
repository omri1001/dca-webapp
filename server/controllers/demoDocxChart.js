// demoDocxChart.js

const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
const { createDemoChartBase64 } = require("./chartService");

async function generateDemoDocx() {
    try {
        // 1. Load the docx template (ensure this path matches your setup!)
        const templatePath = path.resolve(__dirname, "../views/templateone.docx");
        const templateContent = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(templateContent);

        // 2. Configure docxtemplater-image-module-free
        const imageOptions = {
            centered: false,
            getImage: (base64) => Buffer.from(base64, "base64"),
            getSize: () => [600, 300],
        };

        const doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOptions)],
            paragraphLoop: true,
            linebreaks: true,
        });

        // 3. Generate the chart as base64
        const demoChartBase64 = createDemoChartBase64();

        // 4. Prepare data for docxtemplater
        const templateData = {
            // Must match placeholder in template.docx
            demo_chart: demoChartBase64,
        };

        // 5. Render the document
        doc.render(templateData);

        // 6. Generate buffer for the final docx
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        // 7. Write out to a new file for testing
        const outputFileName = `demo_output.docx`;
        fs.writeFileSync(outputFileName, buf);
        console.log(`File "${outputFileName}" has been generated successfully!`);
    } catch (error) {
        console.error("Error generating demo docx:", error);
    }
}

// Execute immediately if run via CLI
generateDemoDocx();
