import crypto from "crypto";
import User from "../models/userModel.js";
import createTransporter from "../config/mailer/mailer.js";

export const sendVerificationEmail = async (emailData) => {
  try {
    const { to: email, userId } = emailData;

    // Vérification des paramètres obligatoires
    if (!email || !userId) {
      throw new Error("Email et userId sont requis.");
    }

    const transporter = await createTransporter();

    // Génération du token de vérification
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const verifyTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Mise à jour du token dans la base de données
    const user = await User.findByIdAndUpdate(
      userId,
      {
        verifyToken,
        verifyTokenExpire,
        isVerified: false,
      },
      { new: true }
    );

    if (!user) {
      throw new Error(
        "Utilisateur non trouvé pour l'envoi de l'email de vérification."
      );
    }

    // Options pour l'email
    const mailOptions = {
      from: `"Zayma" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Vérification de votre compte Zayma",
      html: `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333333;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .email-header {
          background: #4CAF50;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
        }
        .email-body h1 {
          color: #333333;
          font-size: 20px;
        }
        .email-body p {
          margin: 10px 0;
        }
        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #4CAF50;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          border-radius: 5px;
        }
        .btn:hover {
          background: #45a049;
        }
        .email-footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #777777;
          background: #f1f1f1;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          Vérification de votre compte
        </div>
        <div class="email-body">
          <h1>Bonjour,</h1>
          <p>Merci de vous être inscrit sur notre plateforme. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <a href="${process.env.BASE_URL}/verify/${verifyToken}" class="btn">Vérifier mon compte</a>
          <p>Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :</p>
          <p>${process.env.BASE_URL}/verify/${verifyToken}</p>
        </div>
        <div class="email-footer">
          <p>© 2024 Votre Application. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `,
    };

    // Envoi de l'email
    const result = await transporter.sendMail(mailOptions);

    console.log("Email de vérification envoyé avec succès !", {
      messageId: result.messageId,
      recipient: email,
    });

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de vérification:",
      error.message
    );
    throw error; // Relancer l'erreur pour une gestion externe
  }
};
