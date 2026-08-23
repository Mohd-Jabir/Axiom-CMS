import express from "express";
import * as authController from './auth.controller.js'
import * as authValidation from './auth.validation.js'
import { authenticate } from "../../middlewares/authentication.js";
import {registerLimiter,loginLimiter,resendVerificationLimiter,refreshTokenLimiter} from '../../middlewares/rateLimit.js'
const authRoutes=express.Router();

authRoutes.post("/register",authValidation.registerSchema,authController.register);
authRoutes.post("/login",loginLimiter,authValidation.loginSchema,authController.login);
authRoutes.post("/logout",authController.logout)
authRoutes.post("/logout-all",authenticate,authController.logoutAll);
authRoutes.post("/refresh-token",refreshTokenLimiter,authController.refreshAccessToken);
// authRoutes.post("/forgot-password",authValidation.forgotSchema,authController.forgotPassword);
// authRoutes.post("/reset-password",authValidation.resetSchema,authController.resetPassword);
// authRoutes.post("/change-password",authController.changePassword);
// authRoutes.get("/verify-email",authController.verifyEmail);
// authRoutes.post("/resend-verification",resendVerificationLimiter,authValidation.resedSchema,authController.resendVerification);
authRoutes.get("/me",authenticate,authController.getCurrentUser);
export default authRoutes;;