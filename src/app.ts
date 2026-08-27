import "./env";

import express from "express";
import cors from "cors";
import { checkDbConnection } from "./config/db";
import { corsOptions } from "./config/cors";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { ExamRepository } from "./repositories/ExamRepository";
import ExamRoute from "./routes/examRoute"
import studentRoutes from "./routes/studentRoutes";

import courseRoute from "./routes/courseRoute";
import questionRoute from "./routes/questionRoute";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoute);
app.use("/api", ExamRoute);
app.use("/api/questions", questionRoute);

app.use(errorHandler); 

const PORT = process.env.PORT ?? 3000;

const start = async (): Promise<void> => {
  await checkDbConnection();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();