import React, { useEffect, useState } from "react";
import { getBottleMovements } from "../api";

export default function Bottles() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getBottleMovements()
      .then((res) => {
        setMovements(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando movimientos", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  // Calcular totales del día
  const today = new Date().toISOString().split("T")[0];

  const recolectadosHoy = movements
    .filter((m) => m.fecha === today && m.tipo === "recolectado")
    .reduce((sum, m) => sum + m.cantidad, 0);

  const entregadosHoy = movements
    .filter((m) => m.fecha === today && m.tipo === "entregado")
    .reduce((sum, m) => sum + m.cantidad, 0);

  const balanceHoy = recolectadosHoy - entregadosHoy;

  return (
    <div>
      <h2>Botellones</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Resumen de hoy</h3>

        <p>
          <strong>Recolectados hoy:</strong> {recolectadosHoy}
        </p>

        <p>
          <strong>Entregados hoy:</strong> {entregadosHoy}
        </p>

        <p>
          <strong>Balance del día:</strong>{" "}
          <span style={{ color: balanceHoy >= 0 ? "green" : "red" }}>
            {balanceHoy}
          </span>
        </p>
      </div>

      <h3>Movimientos recientes</h3>

      {loading && <div className="muted">Cargando...</div>}
      {!loading && movements.length === 0 && (
        <div className="muted">No hay movimientos aún.</div>
      )}

      <div className="list-container">
        {movements.map((mov) => (
          <div className="list-card" key={mov.id}>
            <strong>
              {mov.clientName ? mov.clientName : "Cliente eliminado"}
            </strong>

            <div className="muted">{mov.fecha} — {mov.origen}</div>

            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: mov.tipo === "recolectado" ? "green" : "red",
                marginTop: 5,
              }}
            >
              {mov.tipo === "recolectado" ? "+" : "-"}
              {mov.cantidad}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
