// server/routes.js
const express = require('express');
const router = express.Router();

const reportController = require('./controllers/reportController');
const poolController = require('./controllers/poolController');
const aiController = require('./controllers/gptController');

// NEW:
const downloadReport = require("./controllers/downloadReport");
// Existing routes...
router.get('/reports', reportController.getAllReports);
router.get('/reports/filter', reportController.filterReports);
router.get('/reports/:primaryKey', reportController.getReportByPrimaryKey);
router.post('/reports', reportController.createReport);

// The download route
router.get("/reports/download-doc/:reportId", downloadReport);

// Pools, AI, etc.
router.get('/pools', poolController.getAllPools);
router.get('/pools/:id', poolController.getPoolById);
router.post('/ai-improve-text', aiController.improveText);

//update document
router.put('/reports/:id', reportController.updateReport);
module.exports = router;
