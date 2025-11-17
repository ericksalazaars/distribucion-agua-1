const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      date TEXT,
      fardos INTEGER,
      botellones_solicitados INTEGER,
      botellones_recolectados INTEGER,
      entregados_llenos INTEGER,
      estado TEXT,
      notas TEXT,
      clientName TEXT,
      price_fardo INTEGER,
      price_botellon INTEGER,
      price_botellon_nuevo INTEGER
    );
  `);

  console.log("Tabla 'orders' creada.");
});

db.close();
