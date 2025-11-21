import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// ---------------- CLIENTES ----------------
export const getClients = () => API.get("/api/clients");
export const addClient = (data) => API.post("/api/clients", data);

// ---------------- PEDIDOS -----------------
export const getOrders = () => API.get("/api/orders");
export const addOrder = (data) => API.post("/api/orders", data);
export const entregarPedido = (id, data) =>
  API.put(`/api/orders/${id}/entregar`, data);
export const deleteOrder = (id) => API.delete(`/api/orders/${id}`);

// ---------------- BOTELLONES --------------
export const getMovements = () => API.get("/api/bottle-movements");

// ---------------- FARDOS ------------------
export const getFardos = () => API.get("/api/fardos");
