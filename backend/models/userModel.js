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
    verificationAttemps: {
      type: Number,
      default: 0,
      max: 5,
    },
    lastVerificationAttempt: {
      type: Date,
      default: null,
    },
    verificationAttempsReset: {
      type: Date,
    },
    emailDelay: {
      type: Number,
      default: 0,
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

const errorEmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  errorType: {
    type: String,
    enum: [
      "AUTH ERROR",
      "INVALID EMAIL",
      "CONNCTION_ERROR",
      "MESSAGE_CONSTRUCTOR_ERROR",
      "OTHER_ERROR",
    ],
    required: true,
  },
  errorMessage: {
    type: String,
    required: true,
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});

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

// middleware pour renitialiser les tentives apres 24h
userSchema.methods.resetVerificationAttempts = function () {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (
    !this.verificationAttemptsReset ||
    this.verificationAttemptsReset < twentyFourHoursAgo
  ) {
    this.verificationAttempts = 0;
    this.verificationAttemptsReset = new Date();
  }
};

// methode pour calculer le delai de backoff expontiel
userSchema.methods.calculateBackOffDelay = function () {
  const baseDelay = 5;
  const attempts = this.verificationAttemps;

  return Math.pow(baseDelay, attempts + 1);
};

// methode pour verifier si l'user peut s'envoyer des mails
userSchema.methods.canSendEmail = function () {
  if (this.verificationAttempts === 0) return true;

  // Vérifiez si lastVerificationAttempt existe
  if (!this.lastVerificationAttempt) {
    return true;
  }

  const lastAttempts = this.lastVerificationAttempt;
  const delayMinute = this.calculateBackOffDelay();
  const nextAllowedTime = new Date(lastAttempts.getTime() + delayMinute * 6000);
  return nextAllowedTime <= new Date();
};

// middleware pour renitialiser les tentatives et le delai
userSchema.methods.restVerificationProcess = function () {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (
    !this.verificationAttemptsReset ||
    this.verificationAttemptsReset < twentyFourHoursAgo
  ) {
    this.verificationAttempts = 0;
    this.emailDelay = 0;
    this.verificationAttemptsReset = new Date();
  }
};

const User = mongoose.model("User", userSchema);
const EmailError = mongoose.model("EmailError", errorEmailSchema);

export default User;
export { EmailError };
