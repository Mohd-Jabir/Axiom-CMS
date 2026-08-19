import api from "../../api/axios.js";


export const getCategories = async (params = {}) => {
  const response = await api.get("/category", {
    params,
  });
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/category/${slug}`);

  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post("/category", categoryData);

  return response.data;
};


export const updateCategory = async ({ id, categoryData }) => {
  const response = await api.patch(
    `/category/${id}`,
    categoryData
  );

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/category/${id}`);

  return response.data;
};