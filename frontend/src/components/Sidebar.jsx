import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-item ${isActive ? "active" : ""}`
    }
    onClick={onClick}
  >
    {children}
  </NavLink>
);

export default function Sidebar({ collapsed, onClose, onLinkClick }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* HEADER */}
      <div className="brand">
        <div className="logo">💧</div>
        <div className="title">Distribución Agua</div>

        {/* Botón cerrar SOLO en móvil */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* NAV */}
      <nav className="nav">
        <NavItem to="/clients" onClick={onLinkClick}>
          Clientes
        </NavItem>

        <NavItem to="/orders" onClick={onLinkClick}>
          Pedidos
        </NavItem>

        <NavItem to="/deliveries" onClick={onLinkClick}>
          Entregas
        </NavItem>

        <NavItem to="/income" onClick={onLinkClick}>
          Ingresos
        </NavItem>

        <NavItem to="/bottles" onClick={onLinkClick}>
          Botellones
        </NavItem>
      </nav>

      {/* FOOTER */}
      <footer className="sidebar-footer">
        <small>v1.0 · Erick</small>
      </footer>
    </aside>
  );
}
