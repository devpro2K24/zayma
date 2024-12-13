import cron from "node-cron";
import User from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const notifyUnverifiedUsers = () => {
  // Exécuter une fois par jour à 9h00
  cron.schedule("0 9 * * *", async () => {
    console.log("Cron job started: Sending reminders to unverified users");

    try {
      // Rechercher les utilisateurs non vérifiés créés il y a plus de 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const unverifiedUsers = await User.find({
        isVerified: false,
        createdAt: { $lt: twentyFourHoursAgo },
      });

      if (!unverifiedUsers || unverifiedUsers.length === 0) {
        console.log("Aucun utilisateur non vérifié trouvé.");
        return;
      }

      // Limiter le nombre d'emails à envoyer pour éviter la surcharge
      const usersToNotify = unverifiedUsers.slice(0, 50);

      for (const user of usersToNotify) {
        try {
          // Vérifier que l'utilisateur existe et a un email valide
          if (!user || !user.email || !user.verifyToken) {
            console.warn(`Utilisateur invalide: ${user._id}`);
            continue;
          }

          await sendVerificationEmail({
            to: user.email,
            userId: user._id,
            subject: "Rappel : Vérification de votre compte",
            html: `
              <h2>Bonjour ${user.firstName || "Utilisateur"},</h2>
              <p>Nous avons remarqué que vous n'avez pas encore vérifié votre compte.</p>
              <p>Veuillez cliquer sur le lien ci-dessous pour activer votre compte :</p>
              <a href="${process.env.BASE_URL}/verify/${user.verifyToken}" 
                 style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Vérifier mon compte
              </a>
              <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
              <p>Merci,</p>
              <p>L'équipe Zeyma</p>
            `,
          });

          console.log(`Email envoyé à ${user.email}`);
        } catch (emailError) {
          if (emailError.message.includes("Nombre maximal de tentatives")) {
            console.warn(
              `Limite de tentatives atteinte pour l'utilisateur ${user.email}`
            );
          } else {
            console.error(
              `Erreur d'email pour ${user.email}:`,
              emailError.message
            );
          }
        }
      }

      console.log(
        `${usersToNotify.length} emails envoyés pour rappeler la vérification.`
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi des rappels :", error);
    }
  });
};

export default notifyUnverifiedUsers;
