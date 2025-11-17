// backend/migrate_add_column.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.all(`PRAGMA table_info(orders);`, (err, rows) => {
    if (err) {
      console.error("Error reading table info:", err);
      process.exit(1);
    }

    const hasColumn = rows.some(r => r.name === "entregados_llenos");
    if (hasColumn) {
      console.log("Column 'entregados_llenos' already exists. Nothing to do.");
      process.exit(0);
    }

    db.run(`ALTER TABLE orders ADD COLUMN entregados_llenos INTEGER DEFAULT 0`, (err) => {
      if (err) {
        console.error("Error adding column:", err);
        process.exit(1);
      }
      console.log("Column 'entregados_llenos' added successfully.");
      process.exit(0);
    });
  });
});
