const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Modeli
 *
 * Sistemdeki kullanıcıları temsil eder.
 * Admin: Sistemi yöneten kişi (kullanıcı ekleyebilir, proje oluşturabilir)
 * Member: Normal kullanıcı (görevleri yapabilir)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email zorunludur"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Şifre zorunludur"],
    },
    role: {
      type: String,
      enum: ["Admin", "Member"],
      default: "Member",
    },
    // Kullanıcının dahil olduğu projeler
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Şifre hash'leme middleware
 * Kullanıcı kaydedilmeden önce şifreyi hash'ler
 */
userSchema.pre("save", async function (next) {
  // Şifre değişmediyse hash'leme
  if (!this.isModified("passwordHash")) {
    return next();
  }

  // Şifreyi hash'le
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Şifre doğrulama metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// JSON'a çevrilirken şifreyi gizle
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
