import api from "../../api/axios.js";

/*
|--------------------------------------------------------------------------
| TOGGLE LIKE
|--------------------------------------------------------------------------
*/

export const toggleLike = async (postId) => {
  const response = await api.post(`/likes/${postId}/like`);

  return response.data;
};
