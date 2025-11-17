const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

console.log("📦 MOSTRANDO CONTENIDO DE TABLA orders\n");

db.all("SELECT * FROM orders", (err, rows) => {
  if (err) {
    console.log("❌ ERROR:", err);
  } else {
    console.log("📄 FILAS EN orders:", rows.length);
    console.log(rows);
  }

  db.close();
});
