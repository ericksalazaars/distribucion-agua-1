import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    price_fardo: 0,
    price_botellon: "",
    price_botellon_nuevo: "",
  });

  const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  // Cargar clientes
  const fetchClients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/clients`);
      setClients(res.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Manejar cambios del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Guardar cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/clients`, form);
      fetchClients();
      setForm({
        name: "",
        phone: "",
        address: "",
        price_fardo: 0,
        price_botellon: "",
        price_botellon_nuevo: "",
      });
    } catch (error) {
      console.error("Error guardando cliente:", error);
    }
  };

  return (
    <div className="page">
      <h2>Clientes</h2>

      <form onSubmit={handleSubmit} className="card">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price_fardo"
          placeholder="Precio fardo"
          value={form.price_fardo}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price_botellon"
          placeholder="Precio botellón"
          value={form.price_botellon}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price_botellon_nuevo"
          placeholder="Precio botellón nuevo"
          value={form.price_botellon_nuevo}
          onChange={handleChange}
        />

        <button type="submit">Guardar</button>
      </form>

      <h3>Lista de clientes</h3>
      {clients.map((c) => (
        <div key={c.id} className="card">
          <strong>{c.name}</strong> — {c.phone}
          <br />
          {c.address}
        </div>
      ))}
    </div>
  );
}
