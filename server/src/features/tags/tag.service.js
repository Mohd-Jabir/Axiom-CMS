import { Tag } from "./tag.model.js";
import { Post } from "../posts/post.model.js";

export const getTags = async ({ page, limit, search, status, sort }) => {
  const skip = (page - 1) * limit;

  let query = Tag.find().notDeleted();

  if (search) {
    query = query.search(search);
  }

  if (status) {
    query = query.withStatus(status);
  }

  const countQuery = query.clone();

  query = query
    .sort(
      sort === "oldest"
        ? { createdAt: 1 }
        : sort === "name"
          ? { "identity.name": 1 }
          : { createdAt: -1 },
    )
    .skip(skip)
    .limit(limit);

  const tags = await query;

  const total = await countQuery.countDocuments().exec();

  return {
    tags,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTagBySlug = async (slug) => {
  const tag = await Tag.findBySlug(slug).notDeleted();

  if (!tag) {
    const error = new Error("Tag not found.");
    error.statusCode = 404;
    throw error;
  }

  return tag;
};

export const createTag = async (data) => {
  if (data.identity?.name) {
    data.identity.name = data.identity.name.trim();
  }

  const exists = await Tag.exists({
    "identity.name": data.identity.name,
    isDeleted: false,
  });

  if (exists) {
    const error = new Error("Tag already exists.");
    error.statusCode = 409;
    throw error;
  }

  return await Tag.create(data);
};

export const updateTag = async (id, data) => {
  const tag = await Tag.findById(id).notDeleted();

  if (!tag) {
    const error = new Error("Tag not found.");
    error.statusCode = 404;
    throw error;
  }

  if (data.identity?.name) {
    data.identity.name = data.identity.name.trim();

    const exists = await Tag.exists({
      _id: { $ne: id },
      "identity.name": data.identity.name,
      isDeleted: false,
    });
    if (exists) {
      const error = new Error("Tag already exists.");
      error.statusCode = 409;
      throw error;
    }
  }

  tag.set(data);

  await tag.save();

  return tag;
};
export const deleteTag = async (id) => {
  const tag = await Tag.findById(id).notDeleted();

  if (!tag) {
    const error = new Error("Tag not found.");
    error.statusCode = 404;
    throw error;
  }
  // Has posts?
  const hasPosts = await Post.exists({
    "classification.tagIds": id,
    isDeleted: false,
  });

  if (hasPosts) {
    const error = new Error("Cannot delete a tag that is being used by posts.");
    error.statusCode = 409;
    throw error;
  }

  // Soft delete
  tag.isDeleted = true;
  tag.deletedAt = new Date();

  await tag.save();

  return tag;
};
