const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

/**
 * Proje Task'lerini Listele
 * GET /api/tasks?projectId=xxx
 */
exports.getAllTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    // Filter oluştur
    const filter = {};
    if (projectId) {
      filter.projectId = projectId;
    }

    const tasks = await Task.find(filter)
      .populate("projectId", "name")
      .populate("assignedUser", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Task'ler listelenirken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Yeni Task Oluştur
 * POST /api/tasks
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedUser } = req.body;

    // Proje kontrolü
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proje bulunamadı",
      });
    }

    // Atanan kullanıcı kontrolü (varsa)
    if (assignedUser) {
      const user = await User.findById(assignedUser);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Atanan kullanıcı bulunamadı",
        });
      }

      // Kullanıcı bu projede mi?
      if (!project.members.includes(assignedUser)) {
        return res.status(400).json({
          success: false,
          message: "Kullanıcı bu projenin üyesi değil",
        });
      }
    }

    // Yeni task oluştur (status otomatik 'To Do' olur)
    const task = new Task({
      title,
      description,
      projectId,
      assignedUser,
    });

    await task.save();

    await task.populate([
      { path: "projectId", select: "name" },
      { path: "assignedUser", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Task başarıyla oluşturuldu",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Task oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Tek Task Detayı
 * GET /api/tasks/:id
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "name description")
      .populate("assignedUser", "name email role");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task bulunamadı",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Task bilgileri alınırken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Task Güncelle (Status ve Atama Değişikliği)
 * PUT /api/tasks/:id
 *
 * Workflow kuralları Model'de enforce edilir:
 * To Do → In Progress
 * In Progress → Done
 * To Do → Done (engellenecek)
 * Done → başka bir durum (engellenecek)
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedUser } = req.body;

    // Mevcut task'i al
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task bulunamadı",
      });
    }

    // Atanan kullanıcı değişiyorsa kontrol et
    if (assignedUser && assignedUser !== task.assignedUser?.toString()) {
      const user = await User.findById(assignedUser);
      const project = await Project.findById(task.projectId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Atanan kullanıcı bulunamadı",
        });
      }

      if (!project.members.includes(assignedUser)) {
        return res.status(400).json({
          success: false,
          message: "Kullanıcı bu projenin üyesi değil",
        });
      }
    }

    // Güncellemeleri uygula
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (assignedUser !== undefined) task.assignedUser = assignedUser;

    // Kaydet (Model'deki workflow kontrolü çalışacak)
    await task.save();

    await task.populate([
      { path: "projectId", select: "name" },
      { path: "assignedUser", select: "name email" },
    ]);

    res.json({
      success: true,
      message: "Task güncellendi",
      data: task,
    });
  } catch (error) {
    // Workflow hatası özel olarak yakalanır
    if (error.name === "WorkflowError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Task güncellenirken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Task Sil
 * DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Task silindi",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Task silinirken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Kullanıcının Task'leri
 * GET /api/tasks/my-tasks
 */
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedUser: req.user._id })
      .populate("projectId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Task'ler listelenirken hata oluştu",
      error: error.message,
    });
  }
};
