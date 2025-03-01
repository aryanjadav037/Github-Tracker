import express from "express";
import dotenv from "dotenv";
import { Octokit } from "octokit";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./helpers/db.js";
import githubAuthRoutes from "./routes/githubAuth.js";
import githubRoutes from "./routes/githubRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
connectDB(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const app = express();
app.use(express.json())

app.use(cors());
app.use(cookieParser());

// OR set specific allowed origins
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
)
app.use("/auth/github", githubAuthRoutes);
app.use("/organizations", githubRoutes);


app.get("/", (req, res) => {
    res.send("server on!!!")
})

app.listen(process.env.PORT)