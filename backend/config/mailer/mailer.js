import nodemailer from "nodemailer";

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Corrigé
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
