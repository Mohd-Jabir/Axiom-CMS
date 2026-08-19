import mongoose from "mongoose";

export const listPostsSchema = (req, res, next) => {
  let {
    search,
    category,
    tag,
    author,
    page = "1",
    limit = "10",
    sort = "newest",
  } = req.query;

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page <= 0) {
    const error = new Error("Page must be a positive integer.");
    error.statusCode = 422;
    return next(error);
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    const error = new Error("Limit must be a positive integer.");
    error.statusCode = 422;
    return next(error);
  }

  if (search !== undefined && typeof search !== "string") {
    const error = new Error("Search must be a string.");
    error.statusCode = 422;
    return next(error);
  }

  if (category && !mongoose.Types.ObjectId.isValid(category)) {
    const error = new Error("Invalid category id.");
    error.statusCode = 422;
    return next(error);
  }

  if (tag && !mongoose.Types.ObjectId.isValid(tag)) {
    const error = new Error("Invalid tag id.");
    error.statusCode = 422;
    return next(error);
  }

  if (author && !mongoose.Types.ObjectId.isValid(author)) {
    const error = new Error("Invalid author id.");
    error.statusCode = 422;
    return next(error);
  }

  const allowedSort = ["newest", "oldest"];

  if (!allowedSort.includes(sort)) {
    const error = new Error("Invalid sort option.");
    error.statusCode = 422;
    return next(error);
  }

  req.query.page = page;
  req.query.limit = limit;
  req.query.sort = sort;

  if (search) req.query.search = search.trim();

  next();
};
export const slugParamSchema = (req, res, next) => {
  const { slug } = req.params;

  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    const error = new Error("Invalid post slug.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
export const createPostSchema = (req, res, next) => {
  const {
    identity = {},
    content = {},
    publishing = {},
    classification = {},
    seo = {},
  } = req.body;
  if (!identity.title) {
    const error = new Error("Title is required.");
    error.statusCode = 422;
    return next(error);
  } else if (typeof identity.title !== "string") {
    const error = new Error("Title must be a string.");
    error.statusCode = 422;
    return next(error);
  } else if (identity.title.trim().length === 0) {
    const error = new Error("Title cannot be empty.");
    error.statusCode = 422;
    return next(error);
  } else if (identity.title.trim().length > 60) {
    const error = new Error("Title cannot exceed 60 characters.");
    error.statusCode = 422;
    return next(error);
  }
  //exert
  if (identity.excerpt !== undefined) {
    if (typeof identity.excerpt !== "string") {
      const error = new Error("Excerpt must be a string.");
      error.statusCode = 422;
      return next(error);
    } else if (identity.excerpt.trim().length > 300) {
      const error = new Error("Excerpt cannot exceed 300 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  if (!content.body) {
    const error = new Error("Body is required.");
    error.statusCode = 422;
    return next(error);
  } else if (typeof content.body !== "string") {
    const error = new Error("Body must be a string.");
    error.statusCode = 422;
    return next(error);
  } else if (content.body.trim().length === 0) {
    const error = new Error("Body cannot be empty.");
    error.statusCode = 422;
    return next(error);
  }
  const allowedFormats = ["markdown", "html", "plaintext", "json"];

  if (
    content.format !== undefined &&
    !allowedFormats.includes(content.format)
  ) {
    const error = new Error("Invalid content format.");
    error.statusCode = 422;
    return next(error);
  }
  if (
    content.coverImage !== undefined &&
    typeof content.coverImage !== "string"
  ) {
    const error = new Error("Cover image must be a string.");
    error.statusCode = 422;
    return next(error);
  }
  if (
    classification.categoryId !== undefined &&
    !mongoose.Types.ObjectId.isValid(classification.categoryId)
  ) {
    const error = new Error("Invalid category id.");
    error.statusCode = 422;
    return next(error);
  }
  if (classification.tagIds !== undefined) {
    if (!Array.isArray(classification.tagIds)) {
      const error = new Error("Tags must be an array.");
      error.statusCode = 422;
      return next(error);
    }

    for (const id of classification.tagIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid tag id.");
        error.statusCode = 422;
        return next(error);
      }
    }
  }
  if (seo.metaTitle !== undefined) {
    if (typeof seo.metaTitle !== "string") {
      const error = new Error("Meta title must be a string.");
      error.statusCode = 422;
      return next(error);
    } else if (seo.metaTitle.trim().length > 60) {
      const error = new Error("Meta title cannot exceed 60 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  if (seo.metaDescription !== undefined) {
    if (typeof seo.metaDescription !== "string") {
      const error = new Error("Meta description must be a string.");
      error.statusCode = 422;
      return next(error);
    } else if (seo.metaDescription.trim().length > 200) {
      const error = new Error("Meta description cannot exceed 200 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }
  identity.title = identity.title.trim();

  content.body = content.body.trim();
  identity.excerpt = identity.excerpt?.trim();

  seo.metaTitle = seo.metaTitle?.trim();

  seo.metaDescription = seo.metaDescription?.trim();
  next();
};
export const updatePostSchema = (req, res, next) => {
  const {
    identity = {},
    content = {},
    publishing = {},
    classification = {},
    seo = {},
  } = req.body;

  if (identity.title !== undefined) {
    if (typeof identity.title !== "string") {
      const error = new Error("Title must be a string.");
      error.statusCode = 422;
      return next(error);
    }

    identity.title = identity.title.trim();

    if (identity.title.length === 0) {
      const error = new Error("Title cannot be empty.");
      error.statusCode = 422;
      return next(error);
    }

    if (identity.title.length > 60) {
      const error = new Error("Title cannot exceed 60 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  if (identity.excerpt !== undefined) {
    if (typeof identity.excerpt !== "string") {
      const error = new Error("Excerpt must be a string.");
      error.statusCode = 422;
      return next(error);
    }

    identity.excerpt = identity.excerpt.trim();

    if (identity.excerpt.length > 300) {
      const error = new Error("Excerpt cannot exceed 300 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  if (content.body !== undefined) {
    if (typeof content.body !== "string") {
      const error = new Error("Body must be a string.");
      error.statusCode = 422;
      return next(error);
    }

    content.body = content.body.trim();

    if (content.body.length === 0) {
      const error = new Error("Body cannot be empty.");
      error.statusCode = 422;
      return next(error);
    }
  }

  const allowedFormats = ["markdown", "html", "plaintext", "json"];

  if (
    content.format !== undefined &&
    !allowedFormats.includes(content.format)
  ) {
    const error = new Error("Invalid content format.");
    error.statusCode = 422;
    return next(error);
  }

  if (
    content.coverImage !== undefined &&
    typeof content.coverImage !== "string"
  ) {
    const error = new Error("Cover image must be a string.");
    error.statusCode = 422;
    return next(error);
  }

  const allowedVisibility = ["public", "private", "unlisted"];

  if (
    publishing.visibility !== undefined &&
    !allowedVisibility.includes(publishing.visibility)
  ) {
    const error = new Error("Invalid visibility.");
    error.statusCode = 422;
    return next(error);
  }

  const allowedStatus = ["draft", "published", "archived"];

  if (
    publishing.status !== undefined &&
    !allowedStatus.includes(publishing.status)
  ) {
    const error = new Error("Invalid status.");
    error.statusCode = 422;
    return next(error);
  }
  if (
    classification.categoryId !== undefined &&
    !mongoose.Types.ObjectId.isValid(classification.categoryId)
  ) {
    const error = new Error("Invalid category id.");
    error.statusCode = 422;
    return next(error);
  }

  if (classification.tagIds !== undefined) {
    if (!Array.isArray(classification.tagIds)) {
      const error = new Error("Tags must be an array.");
      error.statusCode = 422;
      return next(error);
    }

    for (const id of classification.tagIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid tag id.");
        error.statusCode = 422;
        return next(error);
      }
    }
  }

  if (seo.metaTitle !== undefined) {
    if (typeof seo.metaTitle !== "string") {
      const error = new Error("Meta title must be a string.");
      error.statusCode = 422;
      return next(error);
    }

    seo.metaTitle = seo.metaTitle.trim();

    if (seo.metaTitle.length > 60) {
      const error = new Error("Meta title cannot exceed 60 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  if (seo.metaDescription !== undefined) {
    if (typeof seo.metaDescription !== "string") {
      const error = new Error("Meta description must be a string.");
      error.statusCode = 422;
      return next(error);
    }

    seo.metaDescription = seo.metaDescription.trim();

    if (seo.metaDescription.length > 200) {
      const error = new Error("Meta description cannot exceed 200 characters.");
      error.statusCode = 422;
      return next(error);
    }
  }

  next();
};
export const idParamSchema = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid post id.");
    error.statusCode = 422;
    return next(error);
  }
  next();
};
export const myPostsSchema = (req, res, next) => {
  let { page = "1", limit = "10", status, sort = "newest" } = req.query;

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page <= 0) {
    const error = new Error("Page must be a positive integer.");
    error.statusCode = 422;
    return next(error);
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    const error = new Error("Limit must be a positive integer.");
    error.statusCode = 422;
    return next(error);
  }

  if (status && !["draft", "published", "archived"].includes(status)) {
    const error = new Error("Invalid status.");
    error.statusCode = 422;
    return next(error);
  }

  if (sort && !["newest", "oldest"].includes(sort)) {
    const error = new Error("Invalid sort.");
    error.statusCode = 422;
    return next(error);
  }

  req.query.page = page;
  req.query.limit = limit;

  next();
};
