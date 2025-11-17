import { useEffect, useState } from "react";
import axios from "axios";

export default function Fardos() {
  const [rows, setRows] = useState([]);
  const API = "http://localhost:4000/api/fardos";

  useEffect(() => {
    axios
      .get(API)
      .then((res) => setRows(res.data))
      .catch((err) => console.error("Error cargando fardos:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Inventario de Fardos</h2>

      {rows.length === 0 && (
        <p>No hay registros de fardos entregados todavía.</p>
      )}

      {rows.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th
                style={{
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                }}
              >
                Fecha
              </th>
              <th
                style={{
                  padding: "12px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                }}
              >
                Total de fardos
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                style={{
                  background: index % 2 === 0 ? "#fafafa" : "#ffffff",
                }}
              >
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {row.date}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {row.total_fardos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
