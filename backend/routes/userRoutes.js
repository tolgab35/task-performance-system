const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, projectOwnerOnly } = require("../middleware/auth");

/**
 * Tüm route'lar authentication gerektirir
 * Kullanıcıyı projeye ekleme proje sahibi tarafından yapılır
 */

// Tüm kullanıcıları listele
router.get("/", auth, userController.getAllUsers);

// Tek kullanıcı bilgisi
router.get("/:id", auth, userController.getUserById);

// Kullanıcıyı projeye ekle (sadece proje sahibi)
router.post(
  "/:userId/projects/:projectId",
  auth,
  projectOwnerOnly,
  userController.addUserToProject
);

module.exports = router;
