import "./env";

import express from "express";
import cors from "cors";
import { checkDbConnection } from "./config/db";
import { corsOptions } from "./config/cors";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

const start = async (): Promise<void> => {
  await checkDbConnection();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();