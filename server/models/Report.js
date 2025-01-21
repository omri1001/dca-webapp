// server/models/Report.js

const { combatConnection } = require('../dbConnection');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
    {
        date: { type: String, required: true },
        force_name: { type: String, required: true },
        manager: { type: String, required: true },
        location: { type: String, required: true },
        scenarios: {
            scenario_1: { type: String, default: '' },
            scenario_1_AI_used: { type: Boolean, default: false },
            scenario_2: { type: String, default: '' },
            scenario_2_AI_used: { type: Boolean, default: false }
        }
    },
    { collection: 'mock_reports' }
);

module.exports = combatConnection.model('Report', ReportSchema);
