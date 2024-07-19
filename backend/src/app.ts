import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();

//middlewares
app.use(
    cors({
        origin: ["https://mern-open-ai-chat-e1ntt4giy-anjali-s-projects-f5e0f9ef.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true,
    })
);
app.use(express.json());
app.use(morgan("dev")); //remove it in production
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1", appRouter);

export default app;
