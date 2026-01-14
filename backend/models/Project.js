const mongoose = require("mongoose");

/**
 * Project (Workspace) Modeli
 *
 * Her şey bir project içinde gerçekleşir.
 * Kullanıcılar project'lere dahil edilir.
 * Task'ler project'lere ait olur.
 */
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Proje adı zorunludur"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Projeyi oluşturan admin kullanıcı
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Projeye dahil olan kullanıcılar (takım üyeleri)
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
