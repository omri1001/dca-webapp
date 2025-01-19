// server/models/Report.js
const { combatConnection } = require('../dbConnection');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MixedItemsSchema = { type: mongoose.Schema.Types.Mixed, default: {} };
const GradesCategorySchema = new Schema({
    items: MixedItemsSchema,
    comment: String,
    average: Number
});

const ReportSchema = new Schema(
    {
        primary_key: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        force_name: { type: String, required: true },
        manager: { type: String, required: true },
        location: { type: String, required: true },
        scenarios: {
            scenario_1: String,
            scenario_2: String
        },
        grades: {
            'פיקוד ושליטה': GradesCategorySchema,
            'עבודת קשר': GradesCategorySchema
            // Add more categories if needed
        },
        poll_link: String,
        youtube_link: String
    },
    { collection: 'mock_reports' }
);

module.exports = combatConnection.model('Report', ReportSchema);
