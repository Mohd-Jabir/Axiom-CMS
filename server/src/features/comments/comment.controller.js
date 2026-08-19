import * as commentService from "./comment.service.js";
export const getComments = async (req, res, next) => {
  try {
    const { comments, pagination } = await commentService.getComments(
      req.params.postId,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: comments,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
export const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(
      req.user.id,
      req.params.postId,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
