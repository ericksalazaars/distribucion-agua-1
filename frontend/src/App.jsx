import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import Bottles from "./pages/Bottles";
import Income from "./pages/Income";
import Fardos from "./pages/Fardos";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="topbar">
          <h1>Distribución Agua</h1>
        </header>

        <nav className="menu">
          <a href="/">Clientes</a>
          <a href="/orders">Pedidos</a>
          <a href="/deliveries">Entregas</a>
          <a href="/bottles">Botellones</a>
          <a href="/income">Ingresos</a>
          <a href="/fardos">Fardos</a>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Clients />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/bottles" element={<Bottles />} />
            <Route path="/income" element={<Income />} />
            <Route path="/fardos" element={<Fardos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
