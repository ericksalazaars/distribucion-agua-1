import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import Bottles from "./pages/Bottles";
import Fardos from "./pages/Fardos";
import Income from "./pages/Income";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="header">
        <Link to="/">Clientes</Link>
        <Link to="/orders">Pedidos</Link>
        <Link to="/deliveries">Entregas</Link>
        <Link to="/bottles">Botellones</Link>
        <Link to="/fardos">Fardos</Link>
        <Link to="/income">Ingresos</Link>
      </div>

      <div className="content">
        <Routes>
          <Route path="/" element={<Clients />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/bottles" element={<Bottles />} />
          <Route path="/fardos" element={<Fardos />} />
          <Route path="/income" element={<Income />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
