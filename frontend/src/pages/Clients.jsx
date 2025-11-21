import React, { useEffect, useState } from "react";
import { getClients, addClient } from "../api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    price_fardo: 0,
    price_botellon: 0,
    price_botellon_nuevo: 0,
  });

  const load = () => {
    getClients()
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error cargando clientes:", err));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    addClient(form).then(() => {
      setForm({
        name: "",
        phone: "",
        address: "",
        price_fardo: 0,
        price_botellon: 0,
        price_botellon_nuevo: 0,
      });
      load();
    });
  };

  return (
    <div>
      <h2>Clientes</h2>

      <form onSubmit={submit} className="form-card">
        <input placeholder="Nombre" required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input placeholder="Dirección"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input type="number" placeholder="Precio fardo"
          value={form.price_fardo}
          onChange={(e) => setForm({ ...form, price_fardo: e.target.value })}
        />

        <input type="number" placeholder="Precio botellón"
          value={form.price_botellon}
          onChange={(e) => setForm({ ...form, price_botellon: e.target.value })}
        />

        <input type="number" placeholder="Precio botellón nuevo"
          value={form.price_botellon_nuevo}
          onChange={(e) =>
            setForm({ ...form, price_botellon_nuevo: e.target.value })
          }
        />

        <button className="btn-primary">Guardar</button>
      </form>

      <div className="list-container">
        {clients.map((c) => (
          <div className="list-card" key={c.id}>
            <strong>{c.name}</strong>
            <div className="muted">{c.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
