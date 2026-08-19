import rateLimit from "express-rate-limit";
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                 // 200 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many registration attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many Login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const resendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    message:
      "Too many verification email requests. Please try again in one hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Too many refresh requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many user requests.",
  },
});

export const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many post requests.",
  },
});
export const commentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many comments. Please slow down.",
  },
});

export const likeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many like requests.",
  },
});