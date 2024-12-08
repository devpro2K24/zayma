import nodemailer from "nodemailer";

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Corrigé
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Vérifier la configuration
    await transporter.verify();
    console.log("Mail Configured Successfully");
    return transporter;
  } catch (error) {
    console.error("Mail Configuration Error:", error.message);
    throw new Error(
      "Mail configuration failed. Please check your credentials."
    );
  }
};

export default createTransporter;
