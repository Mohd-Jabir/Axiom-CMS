import { Router } from "express";
import * as postValidation from "./post.validation.js";
import * as postController from "./post.controller.js";
import { authenticate } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorization.js";
import { ownership } from "../../middlewares/ownership.js";
import { Post } from "./post.model.js";
import { postLimiter } from "../../middlewares/rateLimit.js";

const postRoutes = Router();

postRoutes.get(
  "/me",
  postLimiter,
  authenticate,
  authorize("admin", "editor", "author", "user"),
  postValidation.myPostsSchema,
  postController.getMyPosts,
);

postRoutes.get(
  "/",
  postLimiter,
  postValidation.listPostsSchema,
  postController.getPosts,
);

postRoutes.get(
  "/slug/:slug",
  postLimiter,
  postValidation.slugParamSchema,
  postController.getPostBySlug,
);
postRoutes.post(
  "/",
  postLimiter,
  authenticate,
  authorize("admin", "editor", "author", "user"),
  postValidation.createPostSchema,
  postController.createPost,
);

postRoutes.patch(
  "/:id",
  postLimiter,
  authenticate,
  authorize("admin", "editor", "author", "user"),
  ownership(Post, "id", "author.authorId"),
  postValidation.updatePostSchema,
  postController.updatePost,
);
postRoutes.delete(
  "/:id",
  postLimiter,
  authenticate,
  authorize("admin", "editor", "author", "user"),
  ownership(Post, "id", "author.authorId"),
  postValidation.idParamSchema,
  postController.deletePost,
);
postRoutes.patch(
  "/:id/publish",
  postLimiter,
  authenticate,
  authorize("admin", "editor", "author", "user"),
  ownership(Post, "id", "author.authorId"),
  postValidation.idParamSchema,
  postController.publishPost,
);

postRoutes.patch(
  "/:id/archive",
  postLimiter,
  authenticate,
  authorize("admin", "editor", "author", "user"),
  ownership(Post, "id", "author.authorId"),
  postValidation.idParamSchema,
  postController.archivePost,
);

postRoutes.get(
  "/:id",
  postLimiter,
  authenticate,
  authorize("admin", "editor"),
  postValidation.idParamSchema,
  postController.getPostById,
);

export default postRoutes;