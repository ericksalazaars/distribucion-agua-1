// frontend/src/pages/Fardos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

function toLocal(dateStr) {
  // Asegura formato YYYY-MM-DD para mostrar
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA");
}

export default function Fardos() {
  const [totals, setTotals] = useState({ today: 0, week: 0, month: 0, total: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    api.get("/api/fardos")
      .then((res) => {
        const data = res.data;
        setTotals(data.totals || { today: 0, week: 0, month: 0, total: 0 });
        setRecent(data.recent || []);
        setError(null);
      })
      .catch((err) => {
        console.error("/api/fardos error", err);
        setError(err?.response?.data?.error || "Error al obtener datos");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // opcional: poll cada 60s
    // const id = setInterval(load, 60000);
    // return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Fardos vendidos</h2>

      <div className="grid-2">
        <div className="card">
          <h3>Hoy</h3>
          <h2 style={{ color: "#1e66d0" }}>{totals.today}</h2>
          <div className="muted">Fardos entregados hoy</div>
        </div>

        <div className="card">
          <h3>Esta semana</h3>
          <h2 style={{ color: "#1e66d0" }}>{totals.week}</h2>
          <div className="muted">Fardos entregados esta semana</div>
        </div>

        <div className="card">
          <h3>Este mes</h3>
          <h2 style={{ color: "#1e66d0" }}>{totals.month}</h2>
          <div className="muted">Fardos entregados este mes</div>
        </div>

        <div className="card">
          <h3>Total histórico</h3>
          <h2 style={{ color: "#1e66d0" }}>{totals.total}</h2>
          <div className="muted">Total de fardos entregados</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Movimientos (pedidos entregados)</h3>

        {loading && <div className="muted">Cargando...</div>}
        {error && <div className="muted" style={{ color: "red" }}>{error}</div>}

        <div className="list-container" style={{ marginTop: 8 }}>
          {recent.length === 0 && !loading && <div className="muted">No hay entregas registradas.</div>}

          {recent.map((r) => (
            <div className="list-card" key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{r.clientName || "Cliente"}</strong>
                  <div className="muted">{toLocal(r.date)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18 }}>{r.fardos} f</div>
                  <div className="muted">Pedido #{r.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={load}>Refrescar</button>
        </div>
      </div>
    </div>
  );
}
