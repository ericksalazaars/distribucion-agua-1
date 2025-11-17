const express = require("express");
const cors = require("cors");

const app = express();

// ----- MIDDLEWARES -----
app.use(express.json());

// CORS (para permitir acceso desde móvil o web)
app.use(cors({
  origin: "*",
}));

// ----- RUTAS -----
const clientsRoutes = require("./routes/clients");
const ordersRoutes = require("./routes/orders");
const bottleMovementsRoutes = require("./routes/bottleMovements");
const fardosRoutes = require("./routes/fardos");

app.use("/api/clients", clientsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/bottle-movements", bottleMovementsRoutes);
app.use("/api/fardos", fardosRoutes);

// ----- SERVIDOR -----
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
