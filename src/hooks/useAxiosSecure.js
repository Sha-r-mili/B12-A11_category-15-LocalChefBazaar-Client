// Axios interceptor hook - attaches JWT token to every secure request

import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Add token to every request automatically
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.authorization = `Bearer ${token}`;
      return config;
    });

    // Handle 401/403 errors automatically
    axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );
  }, [logout]);

  return axiosSecure;
};

export default useAxiosSecure;