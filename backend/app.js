import express from "express";
import cors from "cors";
import morgan from "morgan";   

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import visitorRoutes from "./src/routes/visitorRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));   

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visitors", visitorRoutes);

export default app;
