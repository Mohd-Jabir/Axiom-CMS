import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      return Promise.reject(error);
    }
    const url = originalRequest?.url || "";
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh-token") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newToken) => {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      );
      const newAccessToken = response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error("No accessToken returned from refresh endpoint");
      }
      localStorage.setItem("accessToken", newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers = originalRequest.headers || {};

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
export default api;
