import { Post } from "./post.model.js";
import { Category } from "../categories/category.model.js";
import { Tag } from "../tags/tag.model.js";

const validateCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category || category.isDeleted) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  if (category.status !== "active") {
    const error = new Error("Category is inactive.");
    error.statusCode = 409;
    throw error;
  }

  return category;
};

const validateTags = async (tagIds = []) => {
  if (!tagIds.length) return;

  const tags = await Tag.find({
    _id: { $in: tagIds },
  });

  if (tags.length !== tagIds.length) {
    const error = new Error("One or more tags not found.");
    error.statusCode = 404;
    throw error;
  }

  // If your Tag model has isDeleted:
  const deletedTag = tags.find((tag) => tag.isDeleted);

  if (deletedTag) {
    const error = new Error("One or more tags have been deleted.");
    error.statusCode = 409;
    throw error;
  }

  const inactiveTag = tags.find((tag) => tag.status !== "active");

  if (inactiveTag) {
    const error = new Error("One or more tags are inactive.");
    error.statusCode = 409;
    throw error;
  }
};

export const createPost = async (userId, data) => {
  // Validate category
  if (data.classification?.categoryId) {
    await validateCategory(data.classification.categoryId);
  }

  // Validate tags
  if (data.classification?.tagIds?.length) {
    await validateTags(data.classification.tagIds);
  }

  const post = await Post.create({
    ...data,
    author: {
      authorId: userId,
    },
  });

  return post;
};

export const updatePost = async (id, data) => {
  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  // Updating identity
  if (data.identity) {
    Object.assign(post.identity, data.identity);
  }

  // Updating content
  if (data.content) {
    Object.assign(post.content, data.content);
  }

  // Updating publishing
  if (data.publishing) {
    Object.assign(post.publishing, data.publishing);
  }

  // Updating classification
  if (data.classification) {
    // New category
    if (data.classification.categoryId) {
      await validateCategory(data.classification.categoryId);
    }

    // New tags
    if (data.classification.tagIds) {
      await validateTags(data.classification.tagIds);
    }

    Object.assign(post.classification, data.classification);
  }

  // Updating SEO
  if (data.seo) {
    Object.assign(post.seo, data.seo);
  }

  await post.save();

  return post;
};

export const deletePost = async (id) => {
  const post = await Post.findById(id).notDeleted();

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  post.deletedAt = new Date();

  await post.save();

  return post;
};

export const publishPost = async (id) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  if (post.deletedAt) {
    const error = new Error("Cannot publish a deleted post.");
    error.statusCode = 409;
    throw error;
  }

  if (post.publishing.status === "published") {
    const error = new Error("Post is already published.");
    error.statusCode = 409;
    throw error;
  }

  await post.publish();

  return post;
};

export const archivePost = async (id) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  if (post.deletedAt) {
    const error = new Error("Cannot archive a deleted post.");
    error.statusCode = 409;
    throw error;
  }

  if (post.publishing.status === "archived") {
    const error = new Error("Post is already archived.");
    error.statusCode = 409;
    throw error;
  }

  await post.archive();

  return post;
};

export const getPosts = async ({
  page,
  limit,
  search,
  category,
  tag,
  author,
  sort,
}) => {
  const skip = (page - 1) * limit;

  let query = Post.find().published().publicOnly().notDeleted();

  if (search) {
    query = query.search(search);
  }

  if (category) {
    query = query.byCategory(category);
  }

  if (tag) {
    query = query.byTag(tag);
  }

  if (author) {
    query = query.byAuthor(author);
  }

  const countQuery = query.clone();

  query = sort === "oldest" ? query.oldest() : query.newest();

  query = query
    .skip(skip)
    .limit(limit)
    .select(
      "identity content publishing engagement classification seo createdAt updatedAt",
    )
    .populate(
      "author.authorId",
      "identity.firstName identity.lastName identity.username profile.avatar",
    )
    .populate("classification.categoryId", "identity.name identity.slug")
    .populate("classification.tagIds", "identity.name identity.slug");

  const posts = await query.lean();

  const total = await countQuery.countDocuments().exec();

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPostBySlug = async (slug) => {
  const post = await Post.findOne({
    "identity.slug": slug,
  })
    .published()
    .publicOnly()
    .notDeleted()
    .select(
      "identity content publishing engagement classification seo createdAt updatedAt",
    )
    .populate(
      "author.authorId",
      "identity.firstName identity.lastName identity.username profile.avatar profile.bio",
    )
    .populate("classification.categoryId", "identity.name identity.slug")
    .populate("classification.tagIds", "identity.name identity.slug");

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  await Post.findByIdAndUpdate(post._id, {
    $inc: {
      "engagement.views": 1,
    },
  });

  return post;
};
export const getMyPosts = async (userId, { page, limit, status, sort }) => {
  const skip = (page - 1) * limit;

  let query = Post.find().byAuthor(userId).notDeleted();

  if (status) {
    query = query.withStatus(status);
  }

  const countQuery = query.clone();

  query = sort === "oldest" ? query.oldest() : query.newest();

  query = query
    .skip(skip)
    .limit(limit)
    .select(
      "identity content publishing engagement classification seo author createdAt updatedAt deletedAt",
    )
    .populate(
      "author.authorId",
      "identity.firstName identity.lastName identity.username profile.avatar",
    )
    .populate("classification.categoryId", "identity.name identity.slug")
    .populate("classification.tagIds", "identity.name identity.slug");
  const posts = await query.lean();

  const total = await countQuery.countDocuments();

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPostById = async (id) => {
  const post = await Post.findById(id)
    .populate(
      "author.authorId",
      "identity.firstName identity.lastName identity.username profile.avatar",
    )
    .populate("classification.categoryId", "identity.name identity.slug")
    .populate("classification.tagIds", "identity.name identity.slug");

  if (!post) {
    const error = new Error("Post not found.");
    error.statusCode = 404;
    throw error;
  }

  return post;
};
