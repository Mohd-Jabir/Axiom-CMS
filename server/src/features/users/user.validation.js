import {
  NAME_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} from "../../utils/constants.js";
import mongoose from "mongoose";
export const usernameParamSchema = (req, res, next) => {
  let { username } = req.params;

  if (!username) {
    const error = new Error("Username is required");
    error.statusCode = 422;
    return next(error);
  }
  username = username.trim().toLowerCase();
  if (username.length < 3 || username.length > 30) {
    const error = new Error("Username must be between 3 and 30 characters.");
    error.statusCode = 422;
    return next(error);
  }
  if (!USERNAME_REGEX.test(username)) {
    const error = new Error("Invalid username.");
    error.statusCode = 422;
    return next(error);
  }
  req.params.username = username;
  next();
};
export const updateProfileSchema = (req, res, next) => {
  const allowedFields = ["firstName", "lastName", "bio", "avatar"];
  const updates = req.body;

  // At least one field is required
  if (Object.keys(updates).length === 0) {
    const error = new Error("At least one field is required.");
    error.statusCode = 422;
    return next(error);
  }

  // Reject unknown fields
  const invalidFields = Object.keys(updates).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    const error = new Error(`${invalidFields.join(", ")} cannot be updated.`);
    error.statusCode = 422;
    return next(error);
  }

  // Validate firstName
  if (updates.firstName !== undefined) {
    updates.firstName = updates.firstName.trim();

    if (!NAME_REGEX.test(updates.firstName)) {
      const error = new Error("Invalid first name.");
      error.statusCode = 422;
      return next(error);
    }
  }

  // Validate lastName
  if (updates.lastName !== undefined) {
    updates.lastName = updates.lastName.trim();

    if (!NAME_REGEX.test(updates.lastName)) {
      const error = new Error("Invalid last name.");
      error.statusCode = 422;
      return next(error);
    }
  }

  // Validate bio
  if (updates.bio !== undefined) {
    updates.bio = updates.bio.trim();

    if (updates.bio.length > 300) {
      const error = new Error("Bio cannot exceed 300 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  // Validate avatar
  if (updates.avatar !== undefined) {
    updates.avatar = updates.avatar.trim();

    try {
      new URL(updates.avatar);
    } catch {
      const error = new Error("Invalid avatar URL.");
      error.statusCode = 422;
      return next(error);
    }
  }

  next();
};

// export const changeUsernameSchema = () => {};
// export const changeEmailSchema = () => {};

export const deleteAccountSchema = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    const error = new Error("Password is required.");
    error.statusCode = 422;
    return next(error);
  }

  if (!PASSWORD_REGEX.test(password)) {
    const error = new Error("Invalid password format.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
export const listUsersSchema = (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search = "",
    role,
    status,
    verified,
    sort = "newest",
  } = req.query;
  role = role?.toLowerCase();
  status = status?.toLowerCase();
  page = Number(page);
  limit = Number(limit);
  if (Number.isNaN(page) || page < 1) {
    const error = new Error("Invalid page.");
    error.statusCode = 422;
    return next(error);
  }
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    const error = new Error("Invalid limit.");
    error.statusCode = 422;
    return next(error);
  }
  if (role && !["user", "author", "editor", "admin"].includes(role)) {
    const error = new Error("Invalid role.");
    error.statusCode = 422;
    return next(error);
  }
  if (
    status &&
    !["active", "suspended", "banned", "deactivated"].includes(status)
  ) {
    const error = new Error("Invalid account status.");
    error.statusCode = 422;
    return next(error);
  }
  if (verified && !["true", "false"].includes(verified)) {
    const error = new Error("Invalid verified value.");
    error.statusCode = 422;
    return next(error);
  }
  if (!["newest", "oldest"].includes(sort)) {
    const error = new Error("Invalid sort option.");
    error.statusCode = 422;
    return next(error);
  }
  req.query.page = page;
  req.query.limit = limit;
  req.query.search = search.trim();
  next();
};
export const idParamSchema = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user id.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
export const changeRoleSchema = (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user id.");
    error.statusCode = 422;
    return next(error);
  }
  if (!role) {
    const error = new Error("Role is required.");
    error.statusCode = 422;
    return next(error);
  }
  if (!["user", "author", "editor", "admin"].includes(role)) {
    const error = new Error("Invalid role.");
    error.statusCode = 422;
    return next(error);
  }
  next();
};
