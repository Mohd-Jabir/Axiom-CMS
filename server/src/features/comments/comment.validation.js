import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listCommentsSchema = (req, res, next) => {
  const { postId } = req.params;
  let { page = 1, limit = 10, parentCommentId, sort = "latest" } = req.query;

  if (!isValidObjectId(postId)) {
    const error = new Error("Invalid post id.");
    error.statusCode = 422;
    return next(error);
  }

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
  if (parentCommentId && !isValidObjectId(parentCommentId)) {
    const error = new Error("Invalid parent comment id.");
    error.statusCode = 422;
    return next(error);
  }

  if (sort && !["latest", "oldest"].includes(sort.toLowerCase())) {
    const error = new Error("Sort must be one of: latest, oldest.");
    error.statusCode = 422;
    return next(error);
  }
  req.query.page = page;
  req.query.limit = limit;
  req.query.sort = sort.toLowerCase();

  next();
};
export const createCommentSchema = (req, res, next) => {
  const { postId } = req.params;
  const { hierarchy, content } = req.body;

  if (!isValidObjectId(postId)) {
    const error = new Error("Invalid post id.");
    error.statusCode = 422;
    return next(error);
  }

  if (!content?.body?.trim()) {
    const error = new Error("Comment body is required.");
    error.statusCode = 422;
    return next(error);
  }

  if (content.body.trim().length > 100) {
    const error = new Error("Comment cannot exceed 100 characters.");
    error.statusCode = 422;
    return next(error);
  }

  if (
    hierarchy?.parentCommentId &&
    !isValidObjectId(hierarchy.parentCommentId)
  ) {
    const error = new Error("Invalid parent comment id.");
    error.statusCode = 422;
    return next(error);
  }

  content.body = content.body.trim();

  next();
};
export const idParamSchema = (req, res, next) => {
      const { id } = req.params;

  if (!isValidObjectId(id)) {
    const error = new Error("Invalid comment id.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
