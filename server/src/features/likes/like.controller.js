import * as likeService from './like.service.js'
export const toggleLike=async(req,res,next)=>{
try {
    const result = await likeService.toggleLike(
      req.user.id,
      req.params.postId
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}