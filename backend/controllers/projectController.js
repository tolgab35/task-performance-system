const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

/**
 * Tüm Projeleri Listele
 * GET /api/projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Projeler listelenirken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Yeni Proje Oluştur
 * POST /api/projects
 */
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Yeni proje oluştur
    const project = new Project({
      name,
      description,
      createdBy: req.user._id, // Oluşturan kişi = Proje sahibi (lider)
      members: [req.user._id], // Oluşturan kişiyi otomatik üye yap
    });

    await project.save();

    // Kullanıcının projeler listesine ekle
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { projects: project._id },
    });

    await project.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Proje başarıyla oluşturuldu. Siz bu projenin sahibisiniz.",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Proje oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Tek Proje Detayı
 * GET /api/projects/:id
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proje bulunamadı",
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Proje bilgileri alınırken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Proje İstatistikleri
 * GET /api/projects/:id/stats
 *
 * - Toplam task sayısı
 * - Tamamlanan task sayısı
 * - Devam eden task sayısı
 * - Kullanıcı bazlı tamamlanan task sayıları
 */
exports.getProjectStats = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Projeyi kontrol et
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proje bulunamadı",
      });
    }

    // Tüm task'leri al
    const tasks = await Task.find({ projectId });

    // İstatistikleri hesapla
    const stats = {
      projectName: project.name,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "Done").length,
      inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
      todoTasks: tasks.filter((t) => t.status === "To Do").length,
      userStats: [],
    };

    // Kullanıcı bazlı istatistikler
    const userTaskMap = {};

    for (const task of tasks) {
      if (task.assignedUser) {
        const userId = task.assignedUser.toString();

        if (!userTaskMap[userId]) {
          userTaskMap[userId] = {
            totalAssigned: 0,
            completed: 0,
            inProgress: 0,
            todo: 0,
          };
        }

        userTaskMap[userId].totalAssigned++;

        if (task.status === "Done") {
          userTaskMap[userId].completed++;
        } else if (task.status === "In Progress") {
          userTaskMap[userId].inProgress++;
        } else if (task.status === "To Do") {
          userTaskMap[userId].todo++;
        }
      }
    }

    // Kullanıcı bilgilerini ekle
    for (const userId in userTaskMap) {
      const user = await User.findById(userId).select("name email");
      if (user) {
        stats.userStats.push({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          ...userTaskMap[userId],
        });
      }
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "İstatistikler alınırken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Projeyi Güncelle
 * PUT /api/projects/:id
 *
 * Middleware (projectOwnerOnly) proje sahibi kontrolünü yapar.
 */
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // req.project, projectOwnerOnly middleware'den gelir
    const project = req.project || (await Project.findById(req.params.id));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proje bulunamadı",
      });
    }

    // Güncelleme yap
    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    await project.populate([
      { path: "createdBy", select: "name email" },
      { path: "members", select: "name email role" },
    ]);

    res.json({
      success: true,
      message: "Proje güncellendi",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Proje güncellenirken hata oluştu",
      error: error.message,
    });
  }
};
