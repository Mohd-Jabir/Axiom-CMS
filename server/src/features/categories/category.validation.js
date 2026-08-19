import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listCategoriesSchema = (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    search,
    status,
    parent,
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
    const error = new Error("Invalid status.");
    error.statusCode = 422;
    return next(error);
  }

  if (parent && !isValidObjectId(parent)) {
    const error = new Error("Invalid parent category.");
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
export const createCategorySchema = (req, res, next) => {
  const { identity, parent, appearance, status, seo } = req.body;

  const errors = [];
  if (!identity?.name?.trim()) {
    const error = new Error("Category name is required.");
    error.statusCode = 422;
    return next(error);
  } else if (identity.name.trim().length > 50) {
    const error = new Error("Category name cannot exceed 50 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (identity?.description && identity.description.length > 200) {
    const error = new Error("Description cannot exceed 200 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (parent && !isValidObjectId(parent)) {
    const error = new Error("Invalid parent category.");
    error.statusCode = 422;
    return next(error);
  }

  // Status
  if (status && !["active", "inactive"].includes(status.toLowerCase())) {
    const error = new Error("Invalid category status.");
    error.statusCode = 422;
    return next(error);
  }

  // SEO
  if (seo?.metaTitle && seo.metaTitle.length > 60) {
    const error = new Error("Meta title cannot exceed 60 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (seo?.metaDescription && seo.metaDescription.length > 200) {
    const error = new Error("Meta description cannot exceed 200 characters.");
    error.statusCode = 422;
    return next(error);
  }
  identity.name = identity.name?.trim();
  identity.description = identity.description?.trim();
  seo.metaTitle = seo?.metaTitle?.trim();
  seo.metaDescription = seo?.metaDescription?.trim();
  next();
};
export const updateCategorySchema = (req, res, next) => {
  const { id } = req.params;
  const { identity, parent, status, seo } = req.body;

  if (!isValidObjectId(id)) {
    const error = new Error("Invalid category id.");
    error.statusCode = 422;
    return next(error);
  }

  if (identity?.name !== undefined) {
    if (!identity.name.trim()) {
      const error = new Error("Category name is required.");
      error.statusCode = 422;
      return next(error);
    }

    if (identity.name.trim().length > 50) {
      const error = new Error("Category name cannot exceed 50 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  if (
    identity?.description !== undefined &&
    identity.description.length > 200
  ) {
    const error = new Error("Description cannot exceed 200 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (parent !== undefined && parent !== null && !isValidObjectId(parent)) {
    const error = new Error("Invalid parent category.");
    error.statusCode = 422;
    return next(error);
  }
  if (parent && parent === id) {
    const error = new Error("A category cannot be its own parent.");
    error.statusCode = 422;
    return next(error);
  }
  if (
    status !== undefined &&
    !["active", "inactive"].includes(status.toLowerCase())
  ) {
    const error = new Error("Invalid category status.");
    error.statusCode = 422;
    return next(error);
  }

  if (seo?.metaTitle !== undefined && seo.metaTitle.length > 60) {
    const error = new Error("Meta title cannot exceed 60 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (seo?.metaDescription !== undefined && seo.metaDescription.length > 200) {
    const error = new Error("Meta description cannot exceed 200 characters.");
    error.statusCode = 422;
    return next(error);
  }
  identity.name = identity.name?.trim();
  identity.description = identity.description?.trim();
  seo.metaTitle = seo?.metaTitle?.trim();
  seo.metaDescription = seo?.metaDescription?.trim();
  next();
};
export const idParamSchema = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    const error = new Error("Invalid category id.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
