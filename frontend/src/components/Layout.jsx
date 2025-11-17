import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiUsers,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiDroplet
} from "react-icons/fi";

export default function Layout({ children }) {
  return (
    <div className="list-container">
      {/* Header / Menú superior */}
      <header className="topnav">
        <div className="brand">💧 Agua</div>

        <nav className="nav-menu">
          <NavLink to="/clients" className="nav-link">
            <FiUsers size={16} style={{ marginRight: 6 }} />
            Clientes
          </NavLink>

          <NavLink to="/orders" className="nav-link">
            <FiPackage size={16} style={{ marginRight: 6 }} />
            Pedidos
          </NavLink>

          <NavLink to="/deliveries" className="nav-link">
            <FiTruck size={16} style={{ marginRight: 6 }} />
            Entregas
          </NavLink>

          <NavLink to="/income" className="nav-link">
            <FiDollarSign size={16} style={{ marginRight: 6 }} />
            Ingresos
          </NavLink>

          <NavLink to="/bottles" className="nav-link">
            <FiDroplet size={16} style={{ marginRight: 6 }} />
            Botellones
          </NavLink>
          <NavLink to="/fardos" className="nav-link">
  🧾 Fardos
</NavLink>
        </nav>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}
