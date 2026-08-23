import api from "../../api/axios.js";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const logoutUser = async (logoutData) => {
  const response = await api.post("/auth/logout", logoutData);
  return response.data;
};

export const logoutAllDevice = async (id) => {
  const response = await api.post("/auth/logout-all", { id });
  return response.data;
};

// export const verifyEmail = async (token) => {
//   const response = await api.get("/auth/verify-email", {
//     params: {
//       token,
//     },
//   });

//   return response.data;
// };
// export const resendVerification = async (email) => {
//   const response = await api.post("/auth/resend-verification", {
//     email,
//   });
//   return response.data;
// };

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};