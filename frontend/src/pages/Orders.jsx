import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import {
  getOrders,
  addOrder,
  entregarPedido,
  deleteOrder,
  getClients,
} from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newOrder, setNewOrder] = useState({
    clientId: "",
    date: "",
    fardos: "",
    botellones_solicitados: "",
    notas: "",
  });

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    entregados_llenos: "",
    botellones_recolectados: "",
  });

  // CARGAR CLIENTES Y PEDIDOS
  const load = () => {
    setLoading(true);
    getOrders()
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando pedidos", err);
        setLoading(false);
      });
  };

  const loadClients = () => {
    getClients()
      .then((res) => setClients(res.data || []))
      .catch((err) => console.error("Error cargando clientes", err));
  };

  useEffect(() => {
    load();
    loadClients();
  }, []);

  // CREAR PEDIDO
  const createOrder = (e) => {
    e.preventDefault();

    addOrder({
      ...newOrder,
      fardos: Number(newOrder.fardos),
      botellones_solicitados: Number(newOrder.botellones_solicitados),
    })
      .then(() => {
        setNewOrder({
          clientId: "",
          date: "",
          fardos: "",
          botellones_solicitados: "",
          notas: "",
        });
        load();
      })
      .catch((err) => console.error("Error creando pedido", err));
  };

  // ABRIR MODAL ENTREGA
  const openDelivery = (order) => {
    setSelected(order);
    setForm({ entregados_llenos: "", botellones_recolectados: "" });
  };

  // GUARDAR ENTREGA
  const submitDelivery = () => {
    if (!selected) return;

    entregarPedido(selected.id, {
      entregados_llenos: Number(form.entregados_llenos) || 0,
      botellones_recolectados: Number(form.botellones_recolectados) || 0,
    })
      .then(() => {
        setSelected(null);
        load();
      })
      .catch((err) => console.error("Error entregando pedido", err));
  };

  return (
    <div>
      <h2>Pedidos</h2>

      {/* FORMULARIO DE NUEVO PEDIDO */}
      <div className="form-card">
        <h3>Crear nuevo pedido</h3>

        <form onSubmit={createOrder}>
          <label>Cliente</label>
          <select
            value={newOrder.clientId}
            onChange={(e) =>
              setNewOrder({ ...newOrder, clientId: e.target.value })
            }
            required
          >
            <option value="">Seleccione un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Fecha</label>
          <input
            type="date"
            value={newOrder.date}
            onChange={(e) =>
              setNewOrder({ ...newOrder, date: e.target.value })
            }
            required
          />

          <label>Fardos solicitados</label>
          <input
            type="number"
            value={newOrder.fardos}
            onChange={(e) =>
              setNewOrder({ ...newOrder, fardos: e.target.value })
            }
            required
          />

          <label>Botellones solicitados</label>
          <input
            type="number"
            value={newOrder.botellones_solicitados}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                botellones_solicitados: e.target.value,
              })
            }
          />

          <label>Notas</label>
          <textarea
            value={newOrder.notas}
            onChange={(e) =>
              setNewOrder({ ...newOrder, notas: e.target.value })
            }
          />

          <button className="btn btn-primary" type="submit">
            Crear pedido
          </button>
        </form>
      </div>

      {/* LISTA DE PEDIDOS */}
      {loading && <div className="muted">Cargando...</div>}

      {!loading && orders.length === 0 && (
        <div className="muted">No hay pedidos todavía.</div>
      )}

      <div className="list-container" style={{ marginTop: 10 }}>
        {orders.map((order) => (
          <div className="list-card" key={order.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{order.clientName || "Cliente sin nombre"}</strong>
                <div className="muted">{order.date}</div>
                <div className="muted">Fardos: {order.fardos}</div>
                <div className="muted">
                  Botellones solicitados: {order.botellones_solicitados}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                {order.estado === "pendiente" ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => openDelivery(order)}
                  >
                    <FiCheckCircle /> Entregar
                  </button>
                ) : (
                  <span className="tag-success">Entregado</span>
                )}

                <button
                  className="btn btn-danger"
                  style={{ marginTop: 8 }}
                  onClick={() => deleteOrder(order.id).then(load)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ENTREGA */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Registrar entrega</h3>

            <label>Botellones entregados llenos</label>
            <input
              type="number"
              value={form.entregados_llenos}
              onChange={(e) =>
                setForm({
                  ...form,
                  entregados_llenos: e.target.value,
                })
              }
            />

            <label>Botellones recolectados vacíos</label>
            <input
              type="number"
              value={form.botellones_recolectados}
              onChange={(e) =>
                setForm({
                  ...form,
                  botellones_recolectados: e.target.value,
                })
              }
            />

            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={submitDelivery}>
                Guardar
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
