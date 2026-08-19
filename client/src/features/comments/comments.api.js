import api from "../../api/axios.js";

/*
|--------------------------------------------------------------------------
| GET COMMENTS FOR POST
|--------------------------------------------------------------------------
*/

export const getComments = async (postId, params = {}) => {
  const response = await api.get(`/comments/${postId}/comments`, {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE COMMENT
|--------------------------------------------------------------------------
*/

export const createComment = async ({ postId, body, parentCommentId = null }) => {
  const response = await api.post(`/comments/${postId}/comments`, {
    content: {
      body: body.trim(),
    },

    hierarchy: {
      parentCommentId,
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE COMMENT
|--------------------------------------------------------------------------
*/

export const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`);

  return response.data;
};