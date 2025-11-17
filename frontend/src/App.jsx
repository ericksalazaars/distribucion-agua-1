import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Deliveries from "./pages/Deliveries";
import Income from "./pages/Income";
import Bottles from "./pages/Bottles";
import Fardos from './pages/Fardos';



export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/clients" replace />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/income" element={<Income />} />
        <Route path="/bottles" element={<Bottles />} />
       <Route path="/fardos" element={<Fardos />} />
      </Routes>
    </Layout>
  );
}
