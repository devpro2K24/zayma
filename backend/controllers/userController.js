import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, gender, country } =
    req.body;
  const ipAddress = req.ip;

  // Validation des champs obligatoires
  if (!firstName || !lastName || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs" });
  }

  // Vérification si l'utilisateur existe déjà
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "L'utilisateur existe déjà" });
  }

  // Création de l'utilisateur
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    role,
    ipAddress,
    gender,
    country,
    isVerified: false,
  });

  try {
    // Sauvegarde de l'utilisateur
    await newUser.save();

    // Envoi de l'email de vérification
    await sendVerificationEmail(newUser.email, newUser._id);

    // Génération du token JWT
    const token = createToken(res, newUser._id);

    // Réponse unique avec les informations de l'utilisateur
    return res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      gender: newUser.gender,
      country: newUser.country,
      token: token,
      isVerified: false,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
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

  // Vérification si l'utilisateur est vérifié
  if (!userExist.isVerified) {
    res.status(401).json({
      message: "Account not verified yet! Please verify your account to login",
    });
    return; // Stop l'exécution ici
  }

  // Vérification du mot de passe
  const isMatch = await userExist.matchPassword(password); // Utilisation de la méthode du modèle
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
    throw new Error("Unauthorized");
  }

  const user = await User.findById(req.user._id, {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    isVerified: true,
    lastLogin: true,
    createdAt: true,
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

  const { firstName, lastName, email, password, gender, country } = req.body;

  console.log("Données reçues :", req.body);

  // Validation de l'email pour vérifier qu'il n'est pas déjà utilisé
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Cet email est déjà utilisé par un autre utilisateur.");
    }
  }

  // Mise à jour des champs dynamiquement
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  if (gender) {
    const allowedGenders = ["male", "female", "other"];
    if (!allowedGenders.includes(gender)) {
      res.status(400);
      throw new Error(
        "Genre invalide. Les valeurs acceptées sont: male, female, other."
      );
    }
    user.gender = gender;
  }
  if (country) user.country = country;

  // Sauvegarde
  try {
    console.log("Avant sauvegarde :", user);
    const updatedUser = await user.save();
    console.log("Après sauvegarde :", updatedUser);

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      country: updatedUser.country,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil" });
  }
});

const deleteAccountUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const user = User.findOneAndDelete(req.user._id);
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Account deleted" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully",
    user: {
      id: user._id,
      email: user.email,
      isVerified: true,
    },
  });
});

// ADMIN

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(404);
      throw new Error("Admin cannot be delected");
    }
    await User.deleteMany({ _id: user._id });
    res.status(200).json({ message: "user removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  deleteAccountUser,
  getAllUsers,
  updateUserProfile,
  deleteUserById,
  getUserById,
  verifyEmail,
};
