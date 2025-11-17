// src/api.js
import axios from "axios";

const API_URL = "https://distribucion-agua-1-production.up.railway.app";

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// ---------------- CLIENTES ----------------
export const getClients = () => api.get("/api/clients");
export const addClient = (data) => api.post("/api/clients", data);

// ---------------- PEDIDOS ----------------
export const getOrders = () => api.get("/api/orders");
export const addOrder = (data) => api.post("/api/orders", data);
export const updateOrder = (id, data) => api.put(`/api/orders/${id}`, data);

// ---------------- ENTREGAS (usa orders) ----------------

// ---------------- BOTELLONES ----------------
export const getBottleMovements = () => api.get("/api/bottle-movements");

// ---------------- FARDOS ----------------
export const getFardos = () => api.get("/api/fardos");

// ---------------- INGRESOS ----------------
export const getIncome = () => api.get("/api/income");

export default api;
