import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export default function Income() {
  const [totals, setTotals] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });

  const [recent, setRecent] = useState([]);

  function load() {
    api
      .get("/api/income")
      .then((res) => {
        setTotals(res.data.totals || {});
        setRecent(res.data.recent || []);
      })
      .catch((err) => console.error("Error cargando ingresos:", err));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Ingresos</h2>

      {/* TARJETAS DE TOTALES */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Hoy</h4>
          <p className="stat-number">L {totals.today || 0}</p>
        </div>

        <div className="stat-card">
          <h4>Esta semana</h4>
          <p className="stat-number">L {totals.week || 0}</p>
        </div>

        <div className="stat-card">
          <h4>Este mes</h4>
          <p className="stat-number">L {totals.month || 0}</p>
        </div>

        <div className="stat-card">
          <h4>Total</h4>
          <p className="stat-number">L {totals.total || 0}</p>
        </div>
      </div>

      <h3 style={{ marginTop: 30 }}>Movimientos recientes</h3>

      {recent.length === 0 && <p className="muted">Sin movimientos todavía.</p>}

      <div className="list-container">
        {recent.map((r) => (
          <div className="list-card" key={r.id}>
            <strong>{r.clientName || "Cliente eliminado"}</strong>
            <div className="muted">{r.date}</div>

            <p style={{ fontSize: 18, marginTop: 5 }}>
              Fardos: {r.fardos} × L{r.price_fardo}  
              <br />
              Botellones llenos: {r.entregados_llenos} × L{r.price_botellon}
            </p>

            <p style={{ marginTop: 5, fontWeight: "bold" }}>
              Total: L {r.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
