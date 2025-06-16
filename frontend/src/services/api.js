import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000',// ou a URL da sua API
});

// Token automático em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
