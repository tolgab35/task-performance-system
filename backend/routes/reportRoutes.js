const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { auth } = require("../middleware/auth");

/**
 * Report Routes
 * Tüm route'larda authentication var
 */

// Genel kullanıcı raporu (tüm projeler özeti)
router.get("/overview", auth, reportController.getOverviewReport);

// Proje bazlı detaylı rapor
router.get("/project/:projectId", auth, reportController.getProjectReport);

module.exports = router;
