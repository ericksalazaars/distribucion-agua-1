import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    price_fardo: "",
    price_botellon: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  function fetchClients() {
    api.get("/api/clients")
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCreate(e) {
    e.preventDefault();
    api.post("/api/clients", {
      ...form,
      price_fardo: Number(form.price_fardo || 0),
      price_botellon: Number(form.price_botellon || 0),
    }).then(() => {
      setForm({ name: "", phone: "", address: "", price_fardo: "", price_botellon: "" });
      fetchClients();
    }).catch(console.error);
  }

  function handleDelete(id) {
    if (!confirm("Eliminar cliente?")) return;
    api.delete(`/api/clients/${id}`).then(fetchClients).catch(console.error);
  }

  return (
    <div className="page">
      <h2>Clientes</h2>

      <div className="card grid-2">
        <form className="form" onSubmit={handleCreate}>
          <h3>Agregar cliente</h3>
          <label>Nombre
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>Teléfono
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>

          <label>Dirección
            <input name="address" value={form.address} onChange={handleChange} />
          </label>

          <label>Precio fardo
            <input name="price_fardo" value={form.price_fardo} onChange={handleChange} type="number" step="0.01" />
          </label>

          <label>Precio botellón
            <input name="price_botellon" value={form.price_botellon} onChange={handleChange} type="number" step="0.01" />
          </label>

          <button className="btn-primary" type="submit">Agregar</button>
        </form>

        <div>
          <h3>Lista de clientes</h3>
          <div className="list-container">
            {clients.length === 0 && <div className="muted">No hay clientes aún.</div>}
            {clients.map(c => (
              <div key={c.id} className="list-item">
                <div>
                  <strong>{c.name}</strong>
                  <div className="muted">{c.phone} · {c.address}</div>
                </div>
                <div className="list-actions">
                  <div className="muted">Fardo: {c.price_fardo ?? "-"}</div>
                  <div className="muted">Botellón: {c.price_botellon ?? "-"}</div>
                  <button className="btn-danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
