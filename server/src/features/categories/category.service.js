import { Category } from "./category.model.js";
import { Post } from "../posts/post.model.js";
export const getCategories = async ({
  page,
  limit,
  search,
  status,
  parent,
  sort,
}) => {
  const skip = (page - 1) * limit;
  let query = Category.find()
    .populate("parent", "identity.name identity.slug")
    .notDeleted();

  if (search) {
    query = query.search(search);
  }

  if (status) {
    query = query.withStatus(status);
  }

  if (parent) {
    query = query.withParent(parent);
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

  const categories = await query;

  const total = await countQuery.countDocuments().exec();

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const getCategoryBySlug = async (slug) => {
  const category = await Category.findBySlug(slug)
    .populate("parent", "identity.name identity.slug")
    .notDeleted();

  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  return category;
};
export const createCategory = async (data) => {
  if (data.identity?.name) {
    data.identity.name = data.identity.name.trim();
  }

  // Duplicate name?
  const exists = await Category.exists({
    "identity.name": data.identity.name,
    isDeleted: false,
  });

  if (exists) {
    const error = new Error("Category already exists.");
    error.statusCode = 409;
    throw error;
  }

  // Parent exists?
  if (data.parent) {
    const parent = await Category.findById(data.parent);

    if (!parent) {
      const error = new Error("Parent category not found.");
      error.statusCode = 404;
      throw error;
    }

    // Parent not deleted?
    if (parent.isDeleted) {
      const error = new Error("Parent category has been deleted.");
      error.statusCode = 409;
      throw error;
    }
  }

  return await Category.create(data);
};
export const updateCategory = async (id, data) => {
  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  // Updating name?
  if (data.identity?.name) {
    data.identity.name = data.identity.name.trim();

    // Duplicate name?
    const exists = await Category.exists({
      _id: { $ne: id },
      "identity.name": data.identity.name,
      isDeleted: false,
    });

    if (exists) {
      const error = new Error("Category already exists.");
      error.statusCode = 409;
      throw error;
    }
  }

  // Updating parent?
  if (data.parent) {
    // Parent != self?
    if (data.parent.toString() === id.toString()) {
      const error = new Error("Category cannot be its own parent.");
      error.statusCode = 422;
      throw error;
    }

    // Parent exists?
    const parent = await Category.findById(data.parent);

    if (!parent) {
      const error = new Error("Parent category not found.");
      error.statusCode = 404;
      throw error;
    }

    // Parent not deleted?
    if (parent.isDeleted) {
      const error = new Error("Parent category has been deleted.");
      error.statusCode = 409;
      throw error;
    }

    // Optional: Prevent parent cycles
    let current = parent;

    while (current) {
      if (current._id.toString() === id.toString()) {
        const error = new Error(
          "Cannot assign a child category as the parent.",
        );
        error.statusCode = 422;
        throw error;
      }

      if (!current.parent) break;

      current = await Category.findById(current.parent);
    }
  }

  category.set(data);

  await category.save();

  return category;
};
export const deleteCategory = async (id) => {
  const category = await Category.findById(id);

  if (!category || category.isDeleted) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  // Has child categories?
  const hasChildren = await Category.exists({
    parent: id,
    isDeleted: false,
  });

  if (hasChildren) {
    const error = new Error(
      "Cannot delete a category that has child categories.",
    );
    error.statusCode = 409;
    throw error;
  }

  // Has posts?
  const hasPosts = await Post.exists({
    "classification.categoryId": id,
    isDeleted: false,
  });

  if (hasPosts) {
    const error = new Error(
      "Cannot delete a category that is being used by posts.",
    );
    error.statusCode = 409;
    throw error;
  }

  // Soft delete
  category.isDeleted = true;
  category.deletedAt = new Date();

  await category.save();

  return category;
};
