const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Verificar BD abierta
db.serialize(() => {
  console.log("📦 Base de datos conectada.");
});

// Habilitar claves foráneas
db.run("PRAGMA foreign_keys = ON");

module.exports = db;
