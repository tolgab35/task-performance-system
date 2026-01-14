const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Token Oluşturma
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7 gün geçerli
  });
};

/**
 * Kullanıcı Kaydı
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor",
      });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      name,
      email,
      passwordHash: password,
      role: "Member", // Her kullanıcı otomatik Member
    });

    await user.save();

    // Token oluştur
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcı oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Kullanıcı Girişi
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı",
      });
    }

    // Şifre kontrolü
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email veya şifre hatalı",
      });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Giriş başarılı",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Giriş yapılırken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Mevcut Kullanıcı Bilgisi
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    // req.user auth middleware tarafından eklenir
    const user = await User.findById(req.user._id).populate(
      "projects",
      "name description"
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcı bilgileri alınırken hata oluştu",
      error: error.message,
    });
  }
};
