import { Like } from "./like.model.js";
import { Post } from "../posts/post.model.js";

export const toggleLike = async (userId, postId) => {
  const post = await Post.findById(postId);

  if (!post || post.deletedAt) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  const existingLike = await Like.findOne({
    "ownership.userId": userId,
    "ownership.postId": postId,
  });

  // UNLIKE
  if (existingLike) {
    await existingLike.deleteOne();

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $inc: {
          "engagement.likesCount": -1,
        },
      },
      {
        new: true,
      },
    );

    // Safety: never allow negative count
    if (updatedPost.engagement.likesCount < 0) {
      updatedPost.engagement.likesCount = 0;
      await updatedPost.save();
    }

    return {
      liked: false,
      likesCount: updatedPost.engagement.likesCount,
      message: "Post unliked successfully.",
    };
  }

  // LIKE
  await Like.create({
    ownership: {
      userId,
      postId,
    },
  });

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        "engagement.likesCount": 1,
      },
    },
    {
      new: true,
    },
  );

  return {
    liked: true,
    likesCount: updatedPost.engagement.likesCount,
    message: "Post liked successfully.",
  };
};
