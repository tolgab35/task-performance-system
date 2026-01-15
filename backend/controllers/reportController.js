const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

/**
 * Proje Bazlı Rapor
 * GET /api/reports/project/:projectId
 */
exports.getProjectReport = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Projeyi kontrol et
    const project = await Project.findById(projectId).populate(
      "members",
      "name email"
    );
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proje bulunamadı",
      });
    }

    // Kullanıcı bu projenin üyesi mi kontrol et
    if (
      !project.members.some((m) => m._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Bu projeye erişim yetkiniz yok",
      });
    }

    // Tüm görevleri al
    const tasks = await Task.find({ projectId }).populate(
      "assignedUser",
      "name email"
    );

    // Temel istatistikler
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const todoTasks = tasks.filter((t) => t.status === "To Do").length;

    // Tamamlanma oranı
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Son 7 günde tamamlanan görevler
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const tasksCompletedThisWeek = tasks.filter(
      (t) => t.status === "Done" && new Date(t.updatedAt) >= oneWeekAgo
    ).length;

    // Önceki hafta tamamlanan görevler (karşılaştırma için)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const tasksCompletedLastWeek = tasks.filter(
      (t) =>
        t.status === "Done" &&
        new Date(t.updatedAt) >= twoWeeksAgo &&
        new Date(t.updatedAt) < oneWeekAgo
    ).length;

    // Haftalık performans değişimi
    let weeklyPerformanceChange = 0;
    if (tasksCompletedLastWeek > 0) {
      weeklyPerformanceChange = Math.round(
        ((tasksCompletedThisWeek - tasksCompletedLastWeek) /
          tasksCompletedLastWeek) *
          100
      );
    } else if (tasksCompletedThisWeek > 0) {
      weeklyPerformanceChange = 100;
    }

    // Ortalama tamamlanma süresi (gün)
    const completedTasksWithTime = tasks.filter(
      (t) => t.status === "Done" && t.createdAt && t.updatedAt
    );

    let avgCompletionTime = 0;
    if (completedTasksWithTime.length > 0) {
      const totalDays = completedTasksWithTime.reduce((sum, task) => {
        const created = new Date(task.createdAt);
        const completed = new Date(task.updatedAt);
        const diffTime = Math.abs(completed - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      avgCompletionTime = (totalDays / completedTasksWithTime.length).toFixed(
        1
      );
    }

    // Takım performansı
    const teamPerformance = [];
    const memberTaskMap = new Map();

    // Her üye için görev sayılarını hesapla
    for (const task of tasks) {
      if (task.assignedUser) {
        const odlData = memberTaskMap.get(task.assignedUser._id.toString()) || {
          user: task.assignedUser,
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          todoTasks: 0,
        };

        odlData.totalTasks++;
        if (task.status === "Done") odlData.completedTasks++;
        else if (task.status === "In Progress") odlData.inProgressTasks++;
        else odlData.todoTasks++;

        memberTaskMap.set(task.assignedUser._id.toString(), odlData);
      }
    }

    // Map'i array'e çevir ve performans oranı hesapla
    memberTaskMap.forEach((data) => {
      const performanceRate =
        data.totalTasks > 0
          ? Math.round((data.completedTasks / data.totalTasks) * 100)
          : 0;
      teamPerformance.push({
        user: data.user,
        totalTasks: data.totalTasks,
        completedTasks: data.completedTasks,
        inProgressTasks: data.inProgressTasks,
        todoTasks: data.todoTasks,
        performanceRate,
      });
    });

    // Performansa göre sırala (yüksekten düşüğe)
    teamPerformance.sort((a, b) => b.performanceRate - a.performanceRate);

    res.json({
      success: true,
      data: {
        project: {
          _id: project._id,
          name: project.name,
          memberCount: project.members.length,
        },
        summary: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          completionRate,
          weeklyPerformanceChange,
          tasksCompletedThisWeek,
          avgCompletionTime: parseFloat(avgCompletionTime),
        },
        teamPerformance,
      },
    });
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({
      success: false,
      message: "Rapor oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};

/**
 * Genel Kullanıcı Raporu (Tüm Projeler)
 * GET /api/reports/overview
 */
exports.getOverviewReport = async (req, res) => {
  try {
    // Kullanıcının üyesi olduğu tüm projeler
    const projects = await Project.find({ members: req.user._id });
    const projectIds = projects.map((p) => p._id);

    // Tüm görevler
    const allTasks = await Task.find({ projectId: { $in: projectIds } });

    // Proje istatistikleri
    const totalProjects = projects.length;

    // Aktif projeler (en az bir devam eden görevi olan)
    const activeProjectIds = new Set();
    allTasks.forEach((task) => {
      if (task.status === "In Progress") {
        activeProjectIds.add(task.projectId.toString());
      }
    });
    const activeProjects = activeProjectIds.size;

    // Tamamlanan projeler (tüm görevleri done olan)
    let completedProjects = 0;
    for (const project of projects) {
      const projectTasks = allTasks.filter(
        (t) => t.projectId.toString() === project._id.toString()
      );
      if (
        projectTasks.length > 0 &&
        projectTasks.every((t) => t.status === "Done")
      ) {
        completedProjects++;
      }
    }

    // Toplam görev sayıları
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "Done").length;

    // Ortalama tamamlanma süresi
    const completedTasksWithTime = allTasks.filter(
      (t) => t.status === "Done" && t.createdAt && t.updatedAt
    );

    let avgCompletionTime = 0;
    if (completedTasksWithTime.length > 0) {
      const totalDays = completedTasksWithTime.reduce((sum, task) => {
        const created = new Date(task.createdAt);
        const completed = new Date(task.updatedAt);
        const diffTime = Math.abs(completed - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      avgCompletionTime = (totalDays / completedTasksWithTime.length).toFixed(
        1
      );
    }

    // Benzersiz takım üyeleri
    const uniqueMembers = new Set();
    projects.forEach((p) => {
      p.members.forEach((m) => uniqueMembers.add(m.toString()));
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        avgCompletionTime: parseFloat(avgCompletionTime),
        teamMemberCount: uniqueMembers.size,
      },
    });
  } catch (error) {
    console.error("Overview report error:", error);
    res.status(500).json({
      success: false,
      message: "Genel rapor oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};
