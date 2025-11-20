const sqlite3 = require("sqlite3").verbose();
const { Pool } = require("pg");

const isProduction = !!process.env.DATABASE_URL;

let db = null;
let pgPool = null;

if (isProduction) {
  console.log("➡ Conectando a PostgreSQL (Railway)");

  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

} else {
  console.log("➡ Usando SQLite local");

  db = new sqlite3.Database(
    "./database.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error("❌ Error abriendo SQLite:", err.message);
      } else {
        console.log("SQLite conectado correctamente.");
      }
    }
  );
}

module.exports = { db, pgPool, isProduction };
