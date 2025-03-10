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
 * FILTER reports by multiple criteria
 */
exports.filterReports = async (req, res) => {
    try {
        const { freeText, gdod, pluga, gzera, mission, mentorName, date, hativa, hatmar, reportType } = req.query;
        const q = {};

        // Free text search across multiple fields
        if (freeText && freeText.trim()) {
            q.$or = [
                { primaryKey: { $regex: freeText, $options: 'i' } },
                { gdod: { $regex: freeText, $options: 'i' } },
                { pluga: { $regex: freeText, $options: 'i' } },
                { mentorName: { $regex: freeText, $options: 'i' } },
                { 'data.scenarios.scenario1.scenarioText': { $regex: freeText, $options: 'i' } },
                { 'data.scenarios.scenario2.scenarioText': { $regex: freeText, $options: 'i' } },
            ];
        }

        if (gdod) {
            q.gdod = { $regex: gdod, $options: 'i' };
        }
        if (pluga) {
            q.pluga = { $regex: pluga, $options: 'i' };
        }
        if (gzera) {
            q.gzera = { $regex: gzera, $options: 'i' };
        }
        if (mission) {
            q.mission = { $regex: mission, $options: 'i' };
        }
        if (mentorName) {
            q.mentorName = { $regex: mentorName, $options: 'i' };
        }
        if (date) {
            q.date = date;
        }
        if (hativa) {
            q.hativa = { $regex: hativa, $options: 'i' };
        }
        if (hatmar) {
            q.hatmar = { $regex: hatmar, $options: 'i' };
        }
        // New filter for reportType
        if (reportType) {
            q.reportType = { $regex: reportType, $options: 'i' };
        }

        const reports = await Report.find(q);
        return res.json({ success: true, data: reports });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * CREATE a new report.
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

function parseNumbers(originalBody) {
    const body = JSON.parse(JSON.stringify(originalBody));
    if (body.data && typeof body.data === 'object') {
        if (body.data.grades && typeof body.data.grades === 'object') {
            for (const categoryKey of Object.keys(body.data.grades)) {
                const cat = body.data.grades[categoryKey];
                if (!cat) continue;
                if (cat.average && typeof cat.average === 'object') {
                    cat.average = convertToNumber(cat.average);
                }
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
