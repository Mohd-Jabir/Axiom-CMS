import { Router } from "express";
import * as tagValidation from "./tag.validation.js";
import * as tagController from "./tag.controller.js";
import { authenticate } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorization.js";

const tagRouter = Router();


// GET /tags
tagRouter.get(
  "/",
  tagValidation.listTagsSchema,
  tagController.getTags
);


// GET /tags/:slug
tagRouter.get(
  "/:slug",
  tagValidation.slugParamSchema,
  tagController.getTagBySlug
);


// POST /tags
tagRouter.post(
  "/",
  authenticate,
  authorize("admin", "editor"),
  tagValidation.createTagSchema,
  tagController.createTag
);


// PATCH /tags/:id
tagRouter.patch(
  "/:id",
  authenticate,
  authorize("admin", "editor"),
  tagValidation.updateTagSchema,
  tagController.updateTag
);


// DELETE /tags/:id
tagRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  tagValidation.idParamSchema,
  tagController.deleteTag
);


export default tagRouter;