const express = require("express");
const cors = require("cors");

const clientsRoutes = require("./routes/clients");
const ordersRoutes = require("./routes/orders");
const bottlesRoutes = require("./routes/bottleMovements");
const fardosRoutes = require("./routes/fardos");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas correctas
app.use("/api/clients", clientsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/bottle-movements", bottlesRoutes);
app.use("/api/fardos", fardosRoutes);

// Mensaje Home
app.get("/", (req, res) => {
  res.send("API backend OK");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
