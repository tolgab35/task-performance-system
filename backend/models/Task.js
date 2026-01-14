const mongoose = require("mongoose");

/**
 * Task (Issue) Modeli
 *
 * Her task bir project'e aittir.
 * Workflow: To Do → In Progress → Done
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task başlığı zorunludur"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    // Task aciliyeti
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    // Task kategorisi/türü
    category: {
      type: String,
      enum: ["Ideation", "Design", "Research", "Development"],
      default: "Development",
    },
    // Task'in ait olduğu proje
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Task bir projeye ait olmalıdır"],
    },
    // Task'e atanan kullanıcı
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Workflow Kuralları Kontrolü
 *
 * Sadece belirli durum geçişlerine izin verilir:
 * To Do → In Progress
 * In Progress → Done
 * To Do → Done
 * Done → In Progress veya To Do
 */
taskSchema.pre("save", function (next) {
  // Yeni task ise kontrol yapma
  if (this.isNew) {
    return next();
  }

  // Status değişmemişse kontrol yapma
  if (!this.isModified("status")) {
    return next();
  }

  // Önceki ve yeni durumları al
  const oldStatus = this._original?.status;
  const newStatus = this.status;

  // İzin verilen geçişler
  const allowedTransitions = {
    "To Do": ["In Progress"],
    "In Progress": ["Done"],
    Done: [], // Done'dan başka duruma geçilemez
  };

  // Geçiş kontrolü
  if (!allowedTransitions[oldStatus]?.includes(newStatus)) {
    const error = new Error(
      `Geçersiz durum geçişi: "${oldStatus}" → "${newStatus}" geçişi yapılamaz. ` +
        `İzin verilen geçişler: ${
          allowedTransitions[oldStatus]?.join(", ") || "yok"
        }`
    );
    error.name = "WorkflowError";
    return next(error);
  }

  next();
});

// Orijinal değeri sakla (workflow kontrolü için)
taskSchema.post("init", function (doc) {
  doc._original = doc.toObject();
});

module.exports = mongoose.model("Task", taskSchema);
