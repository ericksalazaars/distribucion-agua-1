import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export default function Bottles() {
  const [movs, setMovs] = useState([]);
  const [totals, setTotals] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });

  function load() {
    api
      .get("/api/bottle-movements")
      .then((res) => {
        setMovs(res.data.movements || []);
        setTotals(res.data.totals || {});
      })
      .catch((err) => console.error("Error cargando botellones:", err));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Botellones</h2>

      {/* Totales */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Recolectados hoy</h4>
          <p className="stat-number">{totals.today || 0}</p>
        </div>

        <div className="stat-card">
          <h4>Entregados hoy</h4>
          <p className="stat-number">{totals.sentToday || 0}</p>
        </div>

        <div className="stat-card">
          <h4>Balance del día</h4>
          <p className="stat-number">{(totals.today || 0) - (totals.sentToday || 0)}</p>
        </div>
      </div>

      <h3 style={{ marginTop: 25 }}>Movimientos recientes</h3>

      {movs.length === 0 && <p className="muted">No hay movimientos todavía.</p>}

      <div className="list-container">
        {movs.map((m) => (
          <div className="list-card" key={m.id}>
            <strong>{m.clientName || "Cliente eliminado"}</strong>
            <div className="muted">{m.fecha} — {m.origen}</div>

            <p
              style={{
                fontSize: 20,
                marginTop: 5,
                color: m.tipo === "recolectado" ? "green" : "red",
              }}
            >
              {m.tipo === "recolectado" ? "+" : "-"}
              {m.cantidad}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
