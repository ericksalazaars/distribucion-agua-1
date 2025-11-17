// migrate_all.js — crea las tablas necesarias en ./database.db
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  // clients
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      address TEXT,
      price_fardo REAL,
      price_botellon REAL,
      price_botellon_nuevo REAL
    );
  `);

  // orders
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
      price_fardo REAL,
      price_botellon REAL,
      price_botellon_nuevo REAL
    );
  `);

  // bottle_movements
  db.run(`
    CREATE TABLE IF NOT EXISTS bottle_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      tipo TEXT,
      cantidad INTEGER,
      fecha TEXT,
      origen TEXT,
      clientName TEXT
    );
  `);

  // fardo_movements
  db.run(`
    CREATE TABLE IF NOT EXISTS fardo_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT,
      cantidad INTEGER,
      fecha TEXT,
      origen TEXT,
      orderId INTEGER,
      clientId INTEGER,
      nota TEXT
    );
  `);

  console.log('Migración completa: tablas creadas si no existían.');
});

db.close();
