import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import Income from "./pages/Income";
import Bottles from "./pages/Bottles";
import Fardos from "./pages/Fardos";

export default function App() {
  return (
    <Router>
      <div className="header">
        <h1>Distribución de Agua</h1>
        <nav>
          <a href="/">Clientes</a>
          <a href="/orders">Pedidos</a>
          <a href="/deliveries">Entregas</a>
          <a href="/income">Ingresos</a>
          <a href="/bottles">Botellones</a>
          <a href="/fardos">Fardos</a>
        </nav>
      </div>

      <div className="content">
        <Routes>
          <Route path="/" element={<Clients />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/income" element={<Income />} />
          <Route path="/bottles" element={<Bottles />} />
          <Route path="/fardos" element={<Fardos />} />
        </Routes>
      </div>
    </Router>
  );
}
