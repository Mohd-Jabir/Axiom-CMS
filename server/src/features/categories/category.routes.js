import { Router } from "express";
import * as categoryValidation from './category.validation.js'
import * as categoryController from './category.controller.js'
import {authenticate} from '../../middlewares/authentication.js'
import {authorize} from '../../middlewares/authorization.js'
const categoryRouter=Router();
categoryRouter.get("/",categoryValidation.listCategoriesSchema,categoryController.getCategories);
categoryRouter.get("/:slug",categoryValidation.slugParamSchema,categoryController.getCategoryBySlug);
categoryRouter.post("/",authenticate,authorize("admin","editor"),categoryValidation.createCategorySchema,categoryController.createCategory);
categoryRouter.patch("/:id",authenticate,authorize("admin","editor"),categoryValidation.updateCategorySchema,categoryController.updateCategory);
categoryRouter.delete("/:id",authenticate,authorize("admin"),categoryValidation.idParamSchema,categoryController.deleteCategory)
export default categoryRouter;