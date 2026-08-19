import api from "../../api/axios.js";
export const getUserProfile = async (username) => {
  const response = await api.get(
    `/users/profile/${encodeURIComponent(username)}`
  );
  return response.data;
};
export const updateProfile = async (profileData) => {
  const response = await api.patch(
    "/users/me",
    profileData
  );

  return response.data;
};

export const deleteAccount = async (data) => {
  const response = await api.delete(
    "/users/me",
    {
      data,
    }
  );
  return response.data;
};

//admin
export const getUsers = async (params = {}) => {
  const response = await api.get(
    "/users",
    {
      params,
    }
  );
  return response.data;
};
export const getUserById = async (id) => {
  const response = await api.get(
    `/users/${id}`
  );
  return response.data;
};
export const changeUserRole = async (id, roleData) => {
  const response = await api.patch(
    `/users/${id}/role`,
    roleData
  );

  return response.data;
};