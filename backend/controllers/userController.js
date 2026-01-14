const User = require("../models/User");
const Project = require("../models/Project");

/**
 * Tüm Kullanıcıları Listele
 * GET /api/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("projects", "name")
      .select("-passwordHash");

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcılar listelenirken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Yeni Kullanıcı Oluştur (Admin)
 * POST /api/users
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
      role: role || "Member",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      data: user,
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
 * Kullanıcıyı Projeye Ekle
 * POST /api/users/:userId/projects/:projectId
 *
 * Sadece proje sahibi (createdBy) kendi projesine kullanıcı ekleyebilir.
 * Middleware (projectOwnerOnly) bu kontrolü yapar.
 */
exports.addUserToProject = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    // Kullanıcıyı bul
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    // Proje req.project'ten gelir (projectOwnerOnly middleware'den)
    const project = req.project || (await Project.findById(projectId));

    // Kullanıcı zaten projede mi kontrol et
    if (user.projects.includes(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı zaten bu projede",
      });
    }

    // Kullanıcıyı projeye ekle
    user.projects.push(projectId);
    await user.save();

    // Projeye de kullanıcıyı ekle
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json({
      success: true,
      message: "Kullanıcı projeye eklendi",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kullanıcı projeye eklenirken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Tek Kullanıcı Bilgisi
 * GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "projects",
      "name description"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

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
