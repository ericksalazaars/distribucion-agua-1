const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");


db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS fardo_movements (
id INTEGER PRIMARY KEY AUTOINCREMENT,
tipo TEXT NOT NULL, -- entrada | salida | ajuste
cantidad INTEGER NOT NULL,
fecha TEXT NOT NULL,
origen TEXT, -- compra | pedido | ajuste
orderId INTEGER,
nota TEXT
);
`);


console.log("Tabla 'fardo_movements' creada o ya existía.");
});


db.close();