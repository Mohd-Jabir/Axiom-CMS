import api from "../../api/axios.js";

export const getPosts = async (params = {}) => {
  const response = await api.get("/posts", {
    params,
  });
  return response.data;
};
export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts/slug/${slug}`);
  return response.data;
};
export const createPost = async (postData) => {
  const response = await api.post("/posts", postData);
  return response.data;
};
export const updatePost = async ({ id, postData }) => {
  const response = await api.patch(`/posts/${id}`, postData);
  return response.data;
};
export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);

  return response.data;
};

export const publishPost = async (id) => {
  const response = await api.patch(`/posts/${id}/publish`);

  return response.data;
};

export const archivePost = async (id) => {
  const response = await api.patch(`/posts/${id}/archive`);
  return response.data;
};
export const getMyPosts = async (params = {}) => {
  const response = await api.get("/posts/me", {
    params,
  });

  return response.data;
};
export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};