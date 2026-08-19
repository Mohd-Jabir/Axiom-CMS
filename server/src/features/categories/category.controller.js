import * as categoryService from "./category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const { categories, pagination } = await categoryService.getCategories(
      req.query,
    );

    res.status(200).json({
      success: true,
      data: categories,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
