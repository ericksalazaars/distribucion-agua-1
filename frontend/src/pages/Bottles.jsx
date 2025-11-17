import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Bottles() {
  const [clients, setClients] = useState([]);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsRes, movRes] = await Promise.all([
       axios.get("http://localhost:4000/api/clients"),
        axios.get("http://localhost:4000/api/bottle-movements"),
      ]);

      setClients(clientsRes.data);
      setMovements(movRes.data);
    } catch (err) {
      console.error("ERROR cargando botellones:", err);
    }
  };

  // Calcular saldo por cliente
  const getClientSummary = (clientId) => {
    const clientMovs = movements.filter((m) => m.clientId === clientId);

    const entregados = clientMovs
      .filter((m) => m.tipo === "entregado")
      .reduce((sum, m) => sum + m.cantidad, 0);

    const recolectados = clientMovs
      .filter((m) => m.tipo === "recolectado")
      .reduce((sum, m) => sum + m.cantidad, 0);

    return {
      entregados,
      recolectados,
      saldo: recolectados - entregados,
    };
  };

  return (
    <div className="page-container">
      <h2 className="title">Botellones</h2>

      {/* ==== SALDO POR CLIENTE ==== */}
      <h3 className="section-title">Saldo por cliente</h3>

      {clients.map((c) => {
        const s = getClientSummary(c.id);

        return (
          <div key={c.id} className="card">
            <div className="client-name">{c.name}</div>
            <p><strong>Entregados:</strong> {s.entregados}</p>
            <p><strong>Recolectados:</strong> {s.recolectados}</p>
            <p><strong>Saldo actual:</strong> {s.saldo}</p>
          </div>
        );
      })}

      {/* ==== MOVIMIENTOS ==== */}
      <h3 className="section-title">Movimientos recientes</h3>

      {movements.length === 0 && <p>No hay movimientos aún.</p>}

      {movements.map((m) => (
        <div key={m.id} className="movement-card">
          <div className="movement-header">
            <span className="client-name">{m.clientName || "Cliente eliminado"}</span>
            <span className="movement-date">{m.fecha}</span>
          </div>

          <div className="movement-body">
            <span
              className={
                "movement-number " +
                (m.tipo === "recolectado" ? "positivo" : "negativo")
              }>
              {m.tipo === "recolectado" ? "+" : "-"}
              {m.cantidad}
            </span>

            <span className="movement-origin">({m.origen})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
