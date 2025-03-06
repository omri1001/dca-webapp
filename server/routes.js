// server/routes.js
const express = require('express');
const router = express.Router();

const reportController = require('./controllers/reportController');
const poolController = require('./controllers/poolController');
const aiController = require('./controllers/gptController');

// Two new controllers for docx & pdf
const downloadDocx = require('./controllers/downloadDocxController');
const downloadPdf  = require('./controllers/downloadPdfController');

// ... existing routes ...
router.get('/reports', reportController.getAllReports);
router.get('/reports/filter', reportController.filterReports);
router.get('/reports/:primaryKey', reportController.getReportByPrimaryKey);
router.post('/reports', reportController.createReport);
router.put('/reports/:id', reportController.updateReport);

// 1) Endpoint to download a DOCX
router.get('/reports/download-doc/:reportId', downloadDocx);
// 2) Endpoint to download a PDF
router.get('/reports/download-pdf/:reportId', downloadPdf);

// Pools, AI, etc...
router.get('/pools', poolController.getAllPools);
router.get('/pools/:id', poolController.getPoolById);
router.post('/ai-improve-text', aiController.improveText);

module.exports = router;
