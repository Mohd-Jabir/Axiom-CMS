import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./src/features/auth/auth.routes.js";
import commentRoutes from "./src/features/comments/comment.routes.js";
import userRoutes from "./src/features/users/user.routes.js";
import likeRoutes from "./src/features/likes/like.routes.js";
import postRoutes from "./src/features/posts/post.routes.js";
import categoryRoutes from "./src/features/categories/category.routes.js";
import tagRoutes from "./src/features/tags/tag.routes.js";

import { apiLimiter } from "./src/middlewares/rateLimit.js";
import { connectDb } from "./src/config/db.js";
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();
app.set("trust proxy", 1);
await connectDb();
app.disable("x-powered-by");
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(apiLimiter);

app.use(
  express.json({
    limit: "200kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "200kb",
  }),
);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/posts", postRoutes);

app.use("/api/v1/likes", likeRoutes);

app.use("/api/v1/comments", commentRoutes);

app.use("/api/v1/category", categoryRoutes);

app.use("/api/v1/tag", tagRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
