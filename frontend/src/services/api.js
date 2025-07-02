import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // pega token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // inclui no header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
