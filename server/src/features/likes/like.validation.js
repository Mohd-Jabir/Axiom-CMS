import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const idParamSchema = (req, res, next) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    const error = new Error("Invalid post id.");
    error.statusCode = 422;
    return next(error);
  }

  next();
};
