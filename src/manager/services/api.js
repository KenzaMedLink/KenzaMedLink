import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend.com/api",
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://your-backend.com/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        accessToken = res.data.accessToken;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/manager/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;