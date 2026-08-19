import api from "../../api/axios.js";

/*
|--------------------------------------------------------------------------
| GET ALL TAGS
|--------------------------------------------------------------------------
*/

export const getTags = async (params = {}) => {
  const response = await api.get("/tag", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| GET TAG BY SLUG
|--------------------------------------------------------------------------
*/

export const getTagBySlug = async (slug) => {
  const response = await api.get(`/tag/${slug}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE TAG
| Requires: admin OR editor
|--------------------------------------------------------------------------
*/

export const createTag = async (tagData) => {
  const response = await api.post("/tag", tagData);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE TAG
| Requires: admin OR editor
|--------------------------------------------------------------------------
*/

export const updateTag = async ({ id, tagData }) => {
  const response = await api.patch(`/tag/${id}`, tagData);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE TAG
| Requires: admin
|--------------------------------------------------------------------------
*/

export const deleteTag = async (id) => {
  const response = await api.delete(`/tag/${id}`);

  return response.data;
};
