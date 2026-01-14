const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { auth } = require("../middleware/auth");

// Tüm route'lar authentication gerektirir

// Kullanıcının kendi task'leri
router.get("/my-tasks", auth, taskController.getMyTasks);

// Task listele (query ile filtreleme: ?projectId=xxx)
router.get("/", auth, taskController.getAllTasks);

// Yeni task oluştur
router.post("/", auth, taskController.createTask);

// Tek task detayı
router.get("/:id", auth, taskController.getTaskById);

// Task güncelle (status değişikliği, atama)
router.put("/:id", auth, taskController.updateTask);

// Task sil
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
