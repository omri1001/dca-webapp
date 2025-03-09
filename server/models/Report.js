// server/models/Report.js

const { combatConnection } = require('../dbConnection');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
    {
        primaryKey: { type: String, required: false, unique: true },
        reportType: { type: String, required: false }, // e.g., 'פלוגה' or 'גדוד'
        gdod: { type: String, required: false }, // renamed from battalionName
        pluga: { type: String, default: '' }, // renamed from platoonSymbol; only applicable if reportType === 'פלוגה'
        date: { type: String, required: false },
        mentorName: { type: String, required: false }, // שם חונך
        exerciseManagerName: { type: String, required: false }, // שם מנהל תרגיל
        gzera: { type: String, required: false }, // renamed from map; options: 'a', 'b', 'c'
        mission: { type: String, required: false }, // options: 'a', 'b'
        hativa: { type: String, required: false }, // new field for חטיבה
        hatmar: { type: String, required: false }, // new field for חטמר
        data: {
            grades: {
                // Always store both grade slots.
                type: Schema.Types.Mixed,
                default: {
                    grade1: { name: '', scoreData: { parts: [], finalGrade: 0 } },
                    grade2: { name: '', scoreData: { parts: [], finalGrade: 0 } }
                }
            },
            scenarios: {
                // Always store both scenario slots.
                type: Schema.Types.Mixed,
                default: {
                    scenario1: { scenarioText: '', scenarioUseAI: false },
                    scenario2: { scenarioText: '', scenarioUseAI: false }
                }
            }
        }
    },
    { collection: 'reports' }
);

module.exports = combatConnection.model('Report', ReportSchema);
