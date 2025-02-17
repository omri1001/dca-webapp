// server/controllers/reportController.js

const Report = require('../models/Report');

/**
 * GET all reports
 */
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({});
        return res.json({ success: true, data: reports });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * GET report by primaryKey
 */
exports.getReportByPrimaryKey = async (req, res) => {
    try {
        // Note: We now use "primaryKey" (not "primary_key")
        const doc = await Report.findOne({ primaryKey: req.params.primaryKey });
        if (!doc) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }
        return res.json({ success: true, data: doc });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * FILTER reports by freeText, battalionName, date
 */
exports.filterReports = async (req, res) => {
    try {
        const { freeText, battalionName, date } = req.query;
        const q = {};
        if (freeText && freeText.trim()) {
            q.$or = [
                { primaryKey: { $regex: freeText, $options: 'i' } },
                { battalionName: { $regex: freeText, $options: 'i' } },
                // Now look for scenario text inside data.scenarios
                { 'data.scenarios.scenario1.scenarioText': { $regex: freeText, $options: 'i' } },
                { 'data.scenarios.scenario2.scenarioText': { $regex: freeText, $options: 'i' } }
            ];
        }
        if (battalionName) {
            q.battalionName = { $regex: battalionName, $options: 'i' };
        }
        if (date) {
            q.date = date;
        }
        const reports = await Report.find(q);
        return res.json({ success: true, data: reports });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};
/**
 * CREATE a new report.
 * (Any numeric objects such as { $numberInt: "x" } or { $numberDouble: "y" } are parsed)
 */
exports.createReport = async (req, res) => {
    try {
        const parsedBody = parseNumbers(req.body);
        const newDoc = new Report(parsedBody);
        await newDoc.save();
        return res.json({ success: true, data: newDoc });
    } catch (err) {
        console.error('[createReport] Error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * UPDATE an existing report by _id
 */
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedBody = parseNumbers(req.body);
        const updatedDoc = await Report.findByIdAndUpdate(id, parsedBody, { new: true });
        if (!updatedDoc) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }
        return res.json({ success: true, data: updatedDoc });
    } catch (err) {
        console.error('[updateReport] Error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * Helper: Convert any { $numberInt: "x" } or { $numberDouble: "y" }
 * objects into real JS numbers so that Mongoose accepts them.
 */
function parseNumbers(originalBody) {
    // Deep clone the object to ensure we can traverse it
    const body = JSON.parse(JSON.stringify(originalBody));

    // For nested fields under "data" (for example, grades), convert any numbers
    if (body.data && typeof body.data === 'object') {
        if (body.data.grades && typeof body.data.grades === 'object') {
            for (const categoryKey of Object.keys(body.data.grades)) {
                const cat = body.data.grades[categoryKey];
                if (!cat) continue;
                // Convert "average" if needed
                if (cat.average && typeof cat.average === 'object') {
                    cat.average = convertToNumber(cat.average);
                }
                // Convert each "item" if needed
                if (cat.items && typeof cat.items === 'object') {
                    for (const itemKey of Object.keys(cat.items)) {
                        cat.items[itemKey] = convertToNumber(cat.items[itemKey]);
                    }
                }
            }
        }
    }
    return body;
}

function convertToNumber(valObj) {
    if (!valObj || typeof valObj !== 'object') return valObj;
    if (valObj.$numberInt) {
        return parseInt(valObj.$numberInt, 10);
    }
    if (valObj.$numberDouble) {
        return parseFloat(valObj.$numberDouble);
    }
    return valObj;
}
