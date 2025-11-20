const express = require("express");
const cors = require("cors");
const { db, pgPool, isProduction } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
//  CREAR TABLAS
// --------------------
function createTables() {
  if (!db) {
    console.log("⚠ No hay DB SQLite disponible (probablemente estás en PostgreSQL)");
    return;
  }

  console.log("➡ Creando/verificando tablas SQLite...");

  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      price_fardo REAL DEFAULT 0,
      price_botellon REAL DEFAULT 0,
      price_botellon_nuevo REAL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER NOT NULL,
      date TEXT NOT NULL,
      fardos INTEGER DEFAULT 0,
      botellones_solicitados INTEGER DEFAULT 0,
      botellones_recolectados INTEGER DEFAULT 0,
      entregados_llenos INTEGER DEFAULT 0,
      estado TEXT DEFAULT 'pendiente',
      notas TEXT,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bottle_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      tipo TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      origen TEXT,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    )
  `);

  console.log("Tablas creadas / verificadas.");
}

// --------------------
//  IMPORTAR RUTAS
// --------------------
const clientsRoutes = require("./routes/clients");
const ordersRoutes = require("./routes/orders");
const bottleRoutes = require("./routes/bottleMovements");
const fardosRoutes = require("./routes/fardos");

// --------------------
//  MONTAR RUTAS
// --------------------
app.use("/api/clients", clientsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/bottle-movements", bottleRoutes);
app.use("/api/fardos", fardosRoutes);

// --------------------
//  INICIO DEL SERVIDOR
// --------------------
const PORT = process.env.PORT || 4000;

if (!isProduction) {
  // Solo SQLite local necesita crear tablas
  createTables();
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
