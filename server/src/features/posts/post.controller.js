import * as postService from "./post.service.js";
export const getPosts = async (req, res, next) => {
  try {
    const { posts, pagination } = await postService.getPosts(req.query);

    return res.status(200).json({
      success: true,
      data: posts,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await postService.getPostBySlug(slug);

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
export const createPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const post = await postService.createPost(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedPost = await postService.updatePost(id, req.body);
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await postService.deletePost(id);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postService.publishPost(id);
    return res.status(200).json({
      success: true,
      message: "Post published successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
export const archivePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postService.archivePost(id);
    return res.status(200).json({
      success: true,
      message: "Post archived successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
export const getMyPosts = async (req, res, next) => {
  try {
    const result = await postService.getMyPosts(req.user.id, req.query);
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully.",
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await postService.getPostById(id);
    return res.status(200).json({
      success: true,
      message: "Post fetched successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
