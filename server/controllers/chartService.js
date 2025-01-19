// chartService.js

const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");

Chart.register(...registerables);

/**
 * Create a base64-encoded PNG chart
 */
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

module.exports = {
    createDemoChartBase64,
};
