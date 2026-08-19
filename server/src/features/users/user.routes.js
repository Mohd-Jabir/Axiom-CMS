import { Router } from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import { authenticate } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorization.js";
import { userLimiter } from "../../middlewares/rateLimit.js";
const userRoutes = Router();

userRoutes.get(
  "/profile/:username",
  userLimiter,
  userValidation.usernameParamSchema,
  userController.getUserProfile,
);
userRoutes.patch(
  "/me",
  userLimiter,
  authenticate,
  userValidation.updateProfileSchema,
  userController.updateProfile,
);
// userRoutes.patch("/me/username",authenticate,userValidation.changeUsernameSchema,userController.changeUsername);
// userRoutes.patch("/me/email",authenticate,userValidation.changeEmailSchema,userController.changeEmail);
userRoutes.delete(
  "/me",
  userLimiter,
  authenticate,
  userValidation.deleteAccountSchema,
  userController.deleteAccount,
);
//admin routes

userRoutes.get(
  "/",
  userLimiter,
  authenticate,
  authorize("admin"),
  userValidation.listUsersSchema,
  userController.getUsers,
);
userRoutes.get(
  "/:id",
  userLimiter,
  authenticate,
  authorize("admin"),
  userValidation.idParamSchema,
  userController.getUserById,
);
userRoutes.patch(
  "/:id/role",
  userLimiter,
  authenticate,
  authorize("admin"),
  userValidation.changeRoleSchema,
  userController.changeRole,
);
// userRoutes.patch("/:id/suspend",authenticate,authorize("admin"),userController.suspendUser);
export default userRoutes;
