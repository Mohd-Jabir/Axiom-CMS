import { Router } from "express";
import * as commentValidation from "./comment.validation.js";
import * as commentController from "./comment.controller.js";
import { authenticate } from "../../middlewares/authentication.js";
import { ownership } from "../../middlewares/ownership.js";
import { commentLimiter } from "../../middlewares/rateLimit.js";
import { Comment } from "./comment.model.js";
const commentRouter = Router();

commentRouter.get(
  "/:postId/comments",
  commentLimiter,
  commentValidation.listCommentsSchema,
  commentController.getComments,
);

commentRouter.post(
  "/:postId/comments",
  commentLimiter,
  authenticate,
  commentValidation.createCommentSchema,
  commentController.createComment,
);

//commentRouter.patch("/:id",authenticate,ownership("Comment"),commentValidation.updateCommentSchema,commentController.updateComment);
commentRouter.delete(
  "/:id",
  authenticate,
  commentLimiter,
  commentValidation.idParamSchema,
  ownership(Comment, "id", "ownership.userId"),
  commentController.deleteComment,
);
export default commentRouter;
