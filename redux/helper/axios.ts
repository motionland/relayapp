import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  headers: {
    
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || process.env.NEXT_PUBLIC_DUMMY_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
