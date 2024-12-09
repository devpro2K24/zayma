import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

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
  const newUser = new User({ firstName, lastName, email, password, role });

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

export { registerUser };
