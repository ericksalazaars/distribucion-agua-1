const Database = require("better-sqlite3");

// Railway → carpeta /app
const db = new Database("./database.db", {
  verbose: console.log
});

console.log("SQLite (better-sqlite3) conectado correctamente.");
module.exports = db;
