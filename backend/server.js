import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(errorHandler);

const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.status(200).json({ message: "Bienvenue sur Zayma Ecommerce !" });
});

app.listen(PORT, () => {
  console.log(`Le serveur est en marche sur le port ${PORT}`);
});
