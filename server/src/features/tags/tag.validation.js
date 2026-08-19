import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listTagsSchema = (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    sort = "latest",
  } = req.query;

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) {
    const error = new Error("Page must be a positive integer.");
    error.statusCode = 422;
    return next(error);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    const error = new Error("Limit must be between 1 and 100.");
    error.statusCode = 422;
    return next(error);
  }

  if (search && typeof search !== "string") {
    const error = new Error("Search must be a string.");
    error.statusCode = 422;
    return next(error);
  }

  if (status && !["active", "inactive"].includes(status.toLowerCase())) {
    const error = new Error("Invalid tag status.");
    error.statusCode = 422;
    return next(error);
  }

  if (sort && !["latest", "oldest", "name"].includes(sort.toLowerCase())) {
    const error = new Error("Sort must be one of: latest, oldest, name.");
    error.statusCode = 422;
    return next(error);
  }

  req.query.page = page;
  req.query.limit = limit;
  req.query.sort = sort.toLowerCase();

  next();
};

export const slugParamSchema = (req, res, next) => {
  const { slug } = req.params;

  if (!slug?.trim()) {
    const error = new Error("Slug is required.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};

export const createTagSchema = (req, res, next) => {
  const { identity, status } = req.body;

  if (!identity?.name?.trim()) {
    const error = new Error("Tag name is required.");
    error.statusCode = 422;
    return next(error);
  }

  if (identity.name.trim().length > 50) {
    const error = new Error("Tag name cannot exceed 50 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (
    status &&
    !["active", "inactive"].includes(status.toLowerCase())
  ) {
    const error = new Error("Invalid tag status.");
    error.statusCode = 422;
    return next(error);
  }

  identity.name = identity.name.trim();

  next();
};
export const updateTagSchema = (req, res, next) => {
  const { id } = req.params;
  const { identity, status } = req.body;

  if (!isValidObjectId(id)) {
    const error = new Error("Invalid tag id.");
    error.statusCode = 422;
    return next(error);
  }

  if (identity?.name !== undefined) {
    if (!identity.name.trim()) {
      const error = new Error("Tag name is required.");
      error.statusCode = 422;
      return next(error);
    }

    if (identity.name.trim().length > 50) {
      const error = new Error("Tag name cannot exceed 50 characters.");
      error.statusCode = 422;
      return next(error);
    }

    identity.name = identity.name.trim();
  }

  if (
    status !== undefined &&
    !["active", "inactive"].includes(status.toLowerCase())
  ) {
    const error = new Error("Invalid tag status.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
export const idParamSchema = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    const error = new Error("Invalid tag id.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};