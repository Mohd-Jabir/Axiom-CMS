import { Comment } from "./comment.model.js";
import { Post } from "../posts/post.model.js";

export const getComments = async (
  postId,
  { page, limit, parentCommentId, sort },
) => {
  const skip = (page - 1) * limit;

  const post = await Post.findById(postId);

  if (!post || post.deletedAt) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  let query = Comment.findByPost(postId).notDeleted();

  if (parentCommentId) {
    query = query.replies(parentCommentId);
  } else {
    query = query.topLevel();
  }

  const countQuery = query.clone();

  query = query
    .populate(
      "ownership.userId",
      "identity.firstName identity.lastName identity.username profile.avatar",
    )
    .sort(
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 },
    )
    .skip(skip)
    .limit(limit);

  const comments = await query.lean();

  const total = await countQuery.countDocuments().exec();

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createComment = async (userId, postId, data) => {
  // Check post
  const post = await Post.findById(postId);

  if (!post || post.deletedAt) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  // Validate parent comment
  if (data.hierarchy?.parentCommentId) {
    const parentComment = await Comment.findById(
      data.hierarchy.parentCommentId,
    );

    if (!parentComment) {
      const error = new Error("Parent comment not found.");
      error.statusCode = 404;
      throw error;
    }

    if (parentComment.moderation.deletedAt) {
      const error = new Error(
        "Cannot reply to a deleted comment.",
      );
      error.statusCode = 409;
      throw error;
    }

    if (
      parentComment.ownership.postId.toString() !==
      postId.toString()
    ) {
      const error = new Error(
        "Parent comment does not belong to this post.",
      );
      error.statusCode = 422;
      throw error;
    }
  }

  // Create comment
  const comment = await Comment.create({
    ownership: {
      userId,
      postId,
    },

    hierarchy: {
      parentCommentId:
        data.hierarchy?.parentCommentId || null,
    },

    content: {
      body: data.content.body,
    },
  });

  // Increment comment count
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        "engagement.commentsCount": 1,
      },
    },
    {
      new: true,
    },
  );

  return {
    comment,
    commentsCount: updatedPost.engagement.commentsCount,
  };
};

export const deleteComment = async (id) => {
  const comment = await Comment.findById(id);

  if (!comment || comment.moderation.deletedAt) {
    const error = new Error("Comment not found.");
    error.statusCode = 404;
    throw error;
  }

  await comment.softDelete();

  const updatedPost = await Post.findByIdAndUpdate(
    comment.ownership.postId,
    {
      $inc: {
        "engagement.commentsCount": -1,
      },
    },
    {
      new: true,
    },
  );

  // Safety
  if (updatedPost.engagement.commentsCount < 0) {
    updatedPost.engagement.commentsCount = 0;
    await updatedPost.save();
  }

  return {
    comment,
    commentsCount: updatedPost.engagement.commentsCount,
  };
};