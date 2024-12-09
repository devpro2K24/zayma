import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Schéma de l'utilisateur
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Le prenom est requis"],
    },
    lastName: {
      type: String,
      required: [true, "Le nom est requis"],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false, // Exclut le mot de passe des requêtes par défaut
    },
    ipAddress: { type: String },
    country: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "delivery"], // Définition des rôles possibles
      default: "buyer", // Rôle par défaut
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verifyToken: String,
    verifyTokenExpire: Date,
  },
  { timestamps: true }
);

// Middleware : Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode : Vérifier le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode : Générer un token de réinitialisation de mot de passe
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hasher et définir le resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Définir l'expiration du token (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
