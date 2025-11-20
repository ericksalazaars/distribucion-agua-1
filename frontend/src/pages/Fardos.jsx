import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export default function Fardos() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/api/fardos")
      .then(res => setRows(res.data || []))
      .catch(err => console.error("/api/fardos error", err));
  }, []);

  return (
    <div>
      <h2>Inventario de Fardos</h2>

      {rows.length === 0 && (
        <p className="muted">Sin datos todavía.</p>
      )}

      {rows.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total entregados</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.total_fardos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
