import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  withCredentials: false,
});

export const tokenStorage = {
  setLoginToken: (token: string) =>
    localStorage.setItem("login_token", token),
  getLoginToken: () => localStorage.getItem("login_token"),
  clearLoginToken: () => localStorage.removeItem("login_token"),

  setAuthToken: (token: string) => localStorage.setItem("auth_token", token),
  getAuthToken: () => localStorage.getItem("auth_token"),
  clearAuthToken: () => localStorage.removeItem("auth_token"),
  clearAll: () => {
    localStorage.removeItem("login_token");
    localStorage.removeItem("auth_token");
  },
};

api.interceptors.request.use(
  (config) => {
    const authToken = tokenStorage.getAuthToken();
    const loginToken = tokenStorage.getLoginToken();

    const token = authToken || loginToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
