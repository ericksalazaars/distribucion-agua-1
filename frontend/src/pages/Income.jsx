import React, { useEffect, useState } from "react";
import { getOrders } from "../api";

export default function Income() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getOrders()
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando ingresos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  // Fecha actual
  const today = new Date().toISOString().split("T")[0];

  // Filtrar solo pedidos entregados
  const delivered = orders.filter((o) => o.estado === "entregado");

  // Calcular ingresos por pedido
  const calculateTotal = (o) => {
    const totalFardos = (o.fardos || 0) * (o.price_fardo || 0);
    const totalBotellones =
      (o.entregados_llenos || 0) * (o.price_botellon || 0);
    const totalNuevos =
      (o.botellones_solicitados || 0) * (o.price_botellon_nuevo || 0);

    return totalFardos + totalBotellones + totalNuevos;
  };

  // Totales por periodo
  const totalHoy = delivered
    .filter((o) => o.date === today)
    .reduce((sum, o) => sum + calculateTotal(o), 0);

  const totalSemana = delivered.reduce((sum, o) => {
    const fecha = new Date(o.date);
    const hoy = new Date();
    const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
    return diff <= 7 ? sum + calculateTotal(o) : sum;
  }, 0);

  const totalMes = delivered.reduce((sum, o) => {
    const fecha = new Date(o.date);
    const hoy = new Date();
    return (
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    )
      ? sum + calculateTotal(o)
      : sum;
  }, 0);

  return (
    <div>
      <h2>Ingresos</h2>

      <div className="card">
        <h3>Resumen</h3>
        <p><strong>Hoy:</strong> L {totalHoy}</p>
        <p><strong>Esta semana:</strong> L {totalSemana}</p>
        <p><strong>Este mes:</strong> L {totalMes}</p>
      </div>

      <h3 style={{ marginTop: 20 }}>Historial</h3>

      {loading && <div className="muted">Cargando...</div>}
      {!loading && delivered.length === 0 && (
        <div className="muted">Sin ingresos aún.</div>
      )}

      <div className="list-container">
        {delivered.map((o) => (
          <div className="list-card" key={o.id}>
            <strong>{o.clientName || "Cliente eliminado"}</strong>
            <div className="muted">{o.date}</div>

            <div style={{ marginTop: 5 }}>
              <div className="muted">
                Fardos: {o.fardos} × L{o.price_fardo || 0}
              </div>
              <div className="muted">
                Entregados (llenos): {o.entregados_llenos} × L
                {o.price_botellon || 0}
              </div>
              {o.botellones_solicitados > 0 && (
                <div className="muted">
                  Botellones nuevos: {o.botellones_solicitados} × L
                  {o.price_botellon_nuevo || 0}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 18,
                fontWeight: "bold",
                color: "green",
              }}
            >
              Total: L {calculateTotal(o)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
