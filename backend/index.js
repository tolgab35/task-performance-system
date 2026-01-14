require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database bağlantısı
connectDB();

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: "Task Performance System API - Jira Clone",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      projects: "/api/projects",
      tasks: "/api/tasks",
    },
  });
});

// Route'ları tanımla
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint bulunamadı",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Hata:", err.stack);
  res.status(500).json({
    success: false,
    message: "Sunucu hatası",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server çalışıyor: http://localhost:${PORT}`);
});
