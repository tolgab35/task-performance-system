const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { auth, projectOwnerOnly } = require("../middleware/auth");

/**
 * Tüm route'lar authentication gerektirir
 * Her Member proje oluşturabilir, oluşturan kişi proje sahibi olur
 */

// Tüm projeleri listele
router.get("/", auth, projectController.getAllProjects);

// Yeni proje oluştur (her Member oluşturabilir)
router.post("/", auth, projectController.createProject);

// Tek proje detayı
router.get("/:id", auth, projectController.getProjectById);

// Proje istatistikleri (Jira benzeri raporlama)
router.get("/:id/stats", auth, projectController.getProjectStats);

// Projeyi güncelle (sadece proje sahibi)
router.put("/:id", auth, projectOwnerOnly, projectController.updateProject);

module.exports = router;
