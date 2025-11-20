import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Helpers (GET, POST, PUT, DELETE)
export const get = (url) => API.get(url);
export const post = (url, data) => API.post(url, data);
export const put = (url, data) => API.put(url, data);
export const del = (url) => API.delete(url);
