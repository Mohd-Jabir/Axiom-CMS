import { Router } from "express";
import * as likeController from './like.controller.js'
import * as likeValidation from './like.validation.js'
import {authenticate} from '../../middlewares/authentication.js'
import { likeLimiter } from "../../middlewares/rateLimit.js";
const likeRoutes=Router();

likeRoutes.post("/:postId/like",likeLimiter,authenticate,likeValidation.idParamSchema,likeController.toggleLike);
export default likeRoutes;