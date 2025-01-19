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
 * GET report by primary_key
 */
exports.getReportByPrimaryKey = async (req, res) => {
    try {
        const doc = await Report.findOne({ primary_key: req.params.primaryKey });
        if (!doc) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }
        return res.json({ success: true, data: doc });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * CREATE a new report,
 * parsing { $numberInt } / { $numberDouble } into real numbers
 */
exports.createReport = async (req, res) => {
    try {
        const parsedBody = parseGrades(req.body);
        const newDoc = new Report(parsedBody);
        await newDoc.save();
        return res.json({ success: true, data: newDoc });
    } catch (err) {
        console.error('[createReport] Error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * FILTER reports by freeText, forceName, date
 */
exports.filterReports = async (req, res) => {
    try {
        const { freeText, forceName, date } = req.query;
        const q = {};
        if (freeText && freeText.trim()) {
            q.$or = [
                { primary_key: { $regex: freeText, $options: 'i' } },
                { force_name: { $regex: freeText, $options: 'i' } },
                { 'scenarios.scenario_1': { $regex: freeText, $options: 'i' } },
                { 'scenarios.scenario_2': { $regex: freeText, $options: 'i' } }
            ];
        }
        if (forceName) q.force_name = { $regex: forceName, $options: 'i' };
        if (date) q.date = date;

        const reports = await Report.find(q);
        return res.json({ success: true, data: reports });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * Helper: Convert any { $numberInt: "x" } / { $numberDouble: "y" }
 * into real JS numbers so Mongoose won't reject them.
 */
function parseGrades(originalBody) {
    const body = JSON.parse(JSON.stringify(originalBody));

    if (body.grades && typeof body.grades === 'object') {
        for (const categoryKey of Object.keys(body.grades)) {
            const cat = body.grades[categoryKey];
            if (!cat) continue;

            // Parse "average" if it has { $numberInt } or { $numberDouble }
            if (cat.average && typeof cat.average === 'object') {
                cat.average = convertToNumber(cat.average);
            }

            // Parse each "item" if it has { $numberInt } or { $numberDouble }
            if (cat.items && typeof cat.items === 'object') {
                for (const itemKey of Object.keys(cat.items)) {
                    cat.items[itemKey] = convertToNumber(cat.items[itemKey]);
                }
            }
        }
    }
    return body;
}

/**
 * Convert a potential { $numberInt: "x" } or { $numberDouble: "y" }
 * object into a real numeric value.
 */
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


/**
 * UPDATE an existing report by _id
 */
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;

        // Optionally parse { $numberInt }, { $numberDouble } in the body
        // so Mongoose won't reject them
        const parsedBody = parseGrades(req.body);

        // Find and update, returning the new document
        const updatedDoc = await Report.findByIdAndUpdate(id, parsedBody, {
            new: true
        });

        if (!updatedDoc) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }

        return res.json({ success: true, data: updatedDoc });
    } catch (err) {
        console.error('[updateReport] Error:', err);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};