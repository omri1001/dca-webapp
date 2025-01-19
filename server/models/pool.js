// server/models/Pool.js

const { pollsConnection } = require('../dbConnection');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
Sample JSON:
{
  "_id": {"$oid": "676d235b61c2fb927472f512"},
  "Name": {"$numberDouble":"400.0"},
  "שם מלא":"אור משה",
  "שם הכוח המתאמן":"44 - גדוד 412",
  "יחידה":"פיקוד מרכז",
  "תפקיד":"מ\"מ / סמל / מפקד",
  "החלטות והערכת סיכונים":{"$numberDouble":"3.0"},
  "עבודת צוות":{"$numberDouble":"3.0"},
  "מצבי לחץ ואי ודאות":{"$numberDouble":"4.0"},
  "מעגל פתוח":{"$numberDouble":"0.0"},
  "מעגל פרוץ":{"$numberDouble":"3.0"},
  "הופא":{"$numberDouble":"3.0"},
  "ניווט":{"$numberDouble":"2.0"},
  "11.יישום בשטח":{"$numberInt":"4"},
  "15.אימונים נוספים":{"$numberInt":"5"},
  "16.פתוחה":"היב מעולה, צריך לעשות מס' סימולציות",
  "Month":{"$numberInt":"10"},
  "Year":{"$numberInt":"2024"}
}
*/

const PoolSchema = new Schema(
    {
        // Map fields to English property names:
        name: { type: Number }, // from "Name"

        // Hebrew fields:
        fullName: { type: String },  // was "שם מלא"
        trainingForceName: { type: String },  // was "שם הכוח המתאמן"
        unit: { type: String },      // was "יחידה"
        role: { type: String },      // was "תפקיד"

        decisionsAndRiskAssessment: { type: Number }, // was "החלטות והערכת סיכונים"
        teamwork: { type: Number },            // was "עבודת צוות"
        stressAndUncertainty: { type: Number },// was "מצבי לחץ ואי ודאות"
        openCircle: { type: Number },          // was "מעגל פתוח"
        brokenCircle: { type: Number },        // was "מעגל פרוץ"
        hofa: { type: Number },                // was "הופא"
        navigation: { type: Number },          // was "ניווט"

        // Because these keys start with numbers or have punctuation,
        // we map them to more standard key names
        fieldImplementation: { type: Number }, // was "11.יישום בשטח"
        additionalTraining: { type: Number },  // was "15.אימונים נוספים"
        openQuestion: { type: String },        // was "16.פתוחה"

        month: { type: Number }, // was "Month"
        year: { type: Number }   // was "Year"
    },
    {
        collection: 'polls_trainees'
    }
);

// Use pollsConnection instead of mongoose.model
module.exports = pollsConnection.model('Pool', PoolSchema);
