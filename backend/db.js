// backend/db.js
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Falta DATABASE_URL en variables de entorno");
  process.exit(1);
}

// Pool con SSL (Railway requiere ssl)
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Inicializar tablas si no existen
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        price_fardo NUMERIC DEFAULT 0,
        price_botellon NUMERIC DEFAULT 0,
        price_botellon_nuevo NUMERIC DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        clientId INTEGER NOT NULL REFERENCES clients(id) ON DELETE SET NULL,
        date TEXT NOT NULL,
        fardos INTEGER DEFAULT 0,
        botellones_solicitados INTEGER DEFAULT 0,
        botellones_recolectados INTEGER DEFAULT 0,
        entregados_llenos INTEGER DEFAULT 0,
        estado TEXT DEFAULT 'pendiente',
        notas TEXT
      );

      CREATE TABLE IF NOT EXISTS bottle_movements (
        id SERIAL PRIMARY KEY,
        clientId INTEGER REFERENCES clients(id) ON DELETE SET NULL,
        tipo TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        origen TEXT
      );
    `);
    console.log("Tablas creadas / verificadas.");
  } catch (err) {
    console.error("Error inicializando la BD:", err);
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDB,
};
