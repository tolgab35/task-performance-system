const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Authentication Routes

// Kullanıcı kaydı
router.post("/register", authController.register);

// Kullanıcı girişi
router.post("/login", authController.login);

// Mevcut kullanıcı bilgisi (korumalı)
router.get("/me", auth, authController.getMe);

module.exports = router;
