import axios from 'axios';

const axiosBase = axios.create({
  //baseURL: "http://localhost:8000/api",
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axiosBase;
