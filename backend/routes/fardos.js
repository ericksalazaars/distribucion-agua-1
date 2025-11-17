const express = require('express');
const router = express.Router();
const db = require('../db');


function weekNumber(date) {
const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}


function localYMD(date = new Date()){ return new Date(date).toLocaleDateString('en-CA'); }


// GET totals and recent using orders table (delivered orders)
router.get('/', (req, res) => {
db.all(`SELECT id, clientId, clientName, date, fardos FROM orders WHERE estado='entregado' ORDER BY id DESC LIMIT 500`, (err, rows) => {
if (err) return res.status(500).json({ error: err.message });


const now = new Date();
const nowWeek = weekNumber(now);
const nowMonth = now.getMonth();
const nowYear = now.getFullYear();


let total = 0, today = 0, week = 0, month = 0;
const recent = rows.map(r => {
const f = Number(r.fardos || 0);
total += f;
const d = new Date(r.date + 'T00:00:00');
const ymd = r.date;
if (ymd === localYMD()) today += f;
if (weekNumber(d) === nowWeek && d.getFullYear() === nowYear) week += f;
if (d.getMonth() === nowMonth && d.getFullYear() === nowYear) month += f;
return { id: r.id, clientId: r.clientId, clientName: r.clientName, date: r.date, fardos: f };
});


res.json({ totals: { today, week, month, total }, recent });
});
});


// GET fardo movements (history from movements table)
router.get('/movements', (req, res) => {
db.all('SELECT * FROM fardo_movements ORDER BY id DESC', (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
res.json(rows);
});
});


module.exports = router;