import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  withCredentials: false,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      const authToken = session?.auth_token;

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.debug("Failed to get NextAuth session", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.debug(
        "Authentication error - NextAuth will handle session cleanup"
      );
    }
    return Promise.reject(error);
  }
);

export default api;
