import cron from "node-cron";
import User from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const notifyUnverifiedUsers = () => {
  // Planifier une tâche pour s'exécuter tous les jours à 9h00
  cron.schedule("0 9 * * *", async () => {
    console.log("Cron job started: Sending reminders to unverified users");

    try {
      // Rechercher les utilisateurs non vérifiés
      const unverifiedUsers = await User.find({ isVerified: false });

      // Envoyer un email à chaque utilisateur non vérifié
      for (const user of unverifiedUsers) {
        await sendVerificationEmail({
          to: user.email,
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
            <p>L'équipe Conteo</p>
          `,
        });
      }

      console.log(
        `${unverifiedUsers.length} emails envoyés pour rappeler la vérification.`
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi des rappels :", error);
    }
  });
};

export default notifyUnverifiedUsers;
