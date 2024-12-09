import crypto from "crypto";
import User from "../models/userModel.js";
import createTransporter from "../config/mailer/mailer.js";

export const sendVerificationEmail = async (email, userId) => {
  try {
    const transporter = await createTransporter();

    // Génération du token de vérification
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const verifyTokenExpire = Date.now() + 10 * 60 * 1000;

    // Mise à jour du token dans la base de données
    const user = await User.findByIdAndUpdate(
      userId,
      {
        verifyToken,
        verifyTokenExpire,
      },
      { new: true } // Retourne le document mis à jour
    );

    if (!user) {
      throw new Error(
        "Utilisateur non trouvé pour l'envoi de l'email de vérification."
      );
    }

    // Options pour l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Vérification de votre compte",
      text: `Bonjour, 
        Veuillez cliquer sur ce lien pour valider votre compte : 
        ${process.env.BASE_URL}/verify/${verifyToken}`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);
    console.log("Email de vérification envoyé avec succès !");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de vérification:",
      error.message
    );
    throw new Error("Échec de l'envoi de l'email de vérification.");
  }
};
