import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const ipAddress = req.ip;
  // Validation des champs obligatoires
  if (!firstName || !lastName || !email || !password || !role) {
    res.status(400);
    throw new Error("Veuillez remplir tous les champs");
  }

  // Vérification si l'utilisateur existe déjà
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("L'utilisateur existe déjà");
  }

  // Création de l'utilisateur
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    role,
    ipAddress,
  });

  // Sauvegarde de l'utilisateur AVANT d'envoyer l'email
  await newUser.save();

  // Envoi de l'email de vérification APRÈS avoir sauvegardé l'utilisateur
  try {
    await sendVerificationEmail(newUser.email, newUser._id);
    console.log("Email envoyé");
  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    // Optionnel : Gérer l'erreur d'email sans bloquer l'inscription
  }

  // Génération du token JWT et réponse
  createToken(res, newUser._id);
  res.status(201).json({
    _id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    role: newUser.role,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    res.status(400);
    throw new Error("Veuillez fournir un email et un mot de passe");
  }

  // Recherche de l'utilisateur avec le mot de passe inclus
  const userExist = await User.findOne({ email }).select("+password");
  if (!userExist) {
    res.status(401); // Unauthorized
    throw new Error("Identifiants invalides");
  }

  // Vérification du mot de passe
  const isMatch = await bcrypt.compare(password, userExist.password);
  if (!isMatch) {
    res.status(401); // Unauthorized
    throw new Error("Identifiants invalides");
  }

  // Génération du token et réponse
  createToken(res, userExist._id);
  res.status(200).json({
    _id: userExist._id,
    firstName: userExist.firstName,
    lastName: userExist.lastName,
    email: userExist.email,
    role: userExist.role,
    isAdmin: userExist.isAdmin,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  const user = await User.findById({
    where: { _id: req.user._id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      emailVerified: true,
      lastLogin: true,
      createdAt: true,
    },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // const { firstName, }
});

export { registerUser, loginUser, logoutUser, getUserProfile };
