import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

function toLocalYMD(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-CA");
}

function todayYMD() {
  return new Date().toLocaleDateString("en-CA");
}

function isToday(dateStr) {
  return toLocalYMD(dateStr) === todayYMD();
}

function isThisMonth(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isThisWeek(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const dayOfYear = (date) =>
    Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);

  return (
    Math.floor(dayOfYear(d) / 7) === Math.floor(dayOfYear(now) / 7) &&
    d.getFullYear() === now.getFullYear()
  );
}

export default function Income() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    api
      .get("/api/orders")
      .then((res) => {
        const delivered = res.data.filter((o) => o.estado === "entregado");
        setOrders(delivered);
      })
      .catch(console.error);
  }

  function calcIngreso(order) {
    const priceFardo = Number(order.price_fardo || 0);
    const priceBot = Number(order.price_botellon || 0);

    const totalFardos = Number(order.fardos || 0) * priceFardo;
    const totalBot = Number(order.entregados_llenos || 0) * priceBot;

    return totalFardos + totalBot;
  }

  function suma(list) {
    return list.reduce((sum, o) => sum + calcIngreso(o), 0);
  }

  const todayOrders = orders.filter((o) => isToday(o.date));
  const weekOrders = orders.filter((o) => isThisWeek(o.date));
  const monthOrders = orders.filter((o) => isThisMonth(o.date));

  return (
    <div>
      <h2>Ingresos</h2>

      {/* RESUMEN */}
      <div className="grid-2">
        <div className="card">
          <h3>Hoy</h3>
          <h2 style={{ color: "#1e66d0" }}>L {suma(todayOrders)}</h2>
          <div className="muted">Pedidos entregados: {todayOrders.length}</div>
        </div>

        <div className="card">
          <h3>Semana</h3>
          <h2 style={{ color: "#1e66d0" }}>L {suma(weekOrders)}</h2>
          <div className="muted">Pedidos entregados: {weekOrders.length}</div>
        </div>

        <div className="card">
          <h3>Mes</h3>
          <h2 style={{ color: "#1e66d0" }}>L {suma(monthOrders)}</h2>
          <div className="muted">Pedidos entregados: {monthOrders.length}</div>
        </div>
      </div>

      {/* LISTA DE INGRESOS */}
      <div className="card">
        <h3>Entradas recientes</h3>

        <div className="list-container">
          {orders.map((o) => (
            <div className="list-card" key={o.id}>
              <h3>{o.clientName}</h3>
              <p className="muted">Fecha: {toLocalYMD(o.date)}</p>

              <p className="muted">
                Fardos: {o.fardos} × L{Number(o.price_fardo)}  
                <br />
                Llenos entregados: {o.entregados_llenos} × L{Number(o.price_botellon)}
              </p>

              <strong style={{ fontSize: 20 }}>
                L {calcIngreso(o)}
              </strong>
            </div>
          ))}

          {orders.length === 0 && <div className="muted">No hay ingresos aún.</div>}
        </div>
      </div>
    </div>
  );
}
