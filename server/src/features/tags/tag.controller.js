import * as tagService from "./tag.service.js";

export const getTags = async (req, res, next) => {
  try {
    const { tags, pagination } = await tagService.getTags(req.query);

    res.status(200).json({
      success: true,
      data: tags,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getTagBySlug = async (req, res, next) => {
  try {
    const tag = await tagService.getTagBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const tag = await tagService.createTag(req.body);

    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const tag = await tagService.updateTag(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    await tagService.deleteTag(req.params.id);

    res.status(200).json({
      success: true,
      message: "Tag deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};