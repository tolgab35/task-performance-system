const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");

/**
 * JWT Token Doğrulama Middleware
 *
 * HTTP header'daki token'ı doğrular ve kullanıcı bilgilerini request'e ekler.
 * Korumalı route'larda kullanılır.
 */
const auth = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Yetkilendirme token'ı bulunamadı",
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı veritabanından bul
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Kullanıcı bilgilerini request'e ekle
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Geçersiz token",
      error: error.message,
    });
  }
};

/**
 * Proje Sahibi Kontrolü Middleware
 *
 * Projeyi oluşturan kullanıcı o projenin lideridir.
 * Sadece proje sahibinin (createdBy) belirli işlemleri yapmasına izin verir:
 * - Projeye kullanıcı ekleme
 * - Proje güncelleme
 *
 * auth middleware'den sonra kullanılmalıdır.
 * URL'de :id veya :projectId parametresi olmalıdır.
 */
const projectOwnerOnly = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Proje ID'si bulunamadı",
      });
    }

    // Projeyi bul
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proje bulunamadı",
      });
    }

    // Kullanıcı proje sahibi mi kontrol et
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bu işlem için proje sahibi olmanız gerekiyor",
      });
    }

    // Projeyi request'e ekle (tekrar sorgulanmaması için)
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Yetki kontrolü yapılırken hata oluştu",
      error: error.message,
    });
  }
};

module.exports = { auth, projectOwnerOnly };
