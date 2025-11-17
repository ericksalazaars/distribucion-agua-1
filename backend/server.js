// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// rutas
const clientsRoutes = require("./routes/clients");
const ordersRoutes = require("./routes/orders");
const bottlesRoutes = require("./routes/bottleMovements");
const fardosRoutes = require("./routes/fardos");

app.use("/api/clients", clientsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/bottle-movements", bottlesRoutes);
app.use("/api/fardos", fardosRoutes);

// health check
app.get("/", (req, res) => res.send("API backend OK"));

// init DB y arrancar
const { initDB } = require("./db");

const PORT = process.env.PORT || 4000;

initDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("No se pudo inicializar DB:", err);
    process.exit(1);
  });
