
const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: '',           
  database: 'autolux_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database.');
});

app.get('/api/cars', (req, res) => {
  const { brand, type, min_price, max_price, search } = req.query;

  let sql = 'SELECT * FROM cars WHERE 1=1';
  const params = [];

  if (brand)     { sql += ' AND brand = ?';                          params.push(brand); }
  if (type)      { sql += ' AND type = ?';                           params.push(type); }
  if (min_price) { sql += ' AND price >= ?';                         params.push(Number(min_price)); }
  if (max_price) { sql += ' AND price <= ?';                         params.push(Number(max_price)); }
  if (search)    { sql += ' AND (brand LIKE ? OR name LIKE ?)';      params.push(`%${search}%`, `%${search}%`); }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, count: results.length, cars: results });
  });
});

app.get('/api/cars/:id', (req, res) => {
  db.query('SELECT * FROM cars WHERE id = ?', [req.params.id], (err, results) => {
    if (err)             return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Car not found.' });
    res.json({ success: true, car: results[0] });
  });
});

app.post('/api/cars', (req, res) => {
  const { brand, name, year, type, price, mileage, engine,
          horsepower, transmission, color, fuel, seats,
          badge, badge_class, description, features } = req.body;

  if (!brand || !name || !price)
    return res.status(400).json({ error: 'brand, name, and price are required.' });

  const sql = `INSERT INTO cars
    (brand, name, year, type, price, mileage, engine, horsepower,
     transmission, color, fuel, seats, badge, badge_class, description, features)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    brand, name, year || new Date().getFullYear(), type || 'Sedan',
    price, mileage || 0, engine || '', horsepower || 0,
    transmission || '', color || '', fuel || 'Petrol', seats || 5,
    badge || null, badge_class || null, description || '',
    JSON.stringify(features || [])
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, id: result.insertId, message: 'Car added successfully.' });
  });
});

app.put('/api/cars/:id', (req, res) => {
  const { brand, name, year, type, price, mileage, engine,
          horsepower, transmission, color, fuel, seats,
          badge, badge_class, description, features } = req.body;

  const sql = `UPDATE cars SET
    brand=?, name=?, year=?, type=?, price=?, mileage=?, engine=?,
    horsepower=?, transmission=?, color=?, fuel=?, seats=?,
    badge=?, badge_class=?, description=?, features=?
    WHERE id=?`;

  db.query(sql, [brand, name, year, type, price, mileage, engine,
    horsepower, transmission, color, fuel, seats,
    badge, badge_class, description, JSON.stringify(features || []),
    req.params.id], (err, result) => {
    if (err)                  return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: 'Car not found.' });
    res.json({ success: true, message: 'Car updated.' });
  });
});

app.delete('/api/cars/:id', (req, res) => {
  db.query('DELETE FROM cars WHERE id = ?', [req.params.id], (err, result) => {
    if (err)                  return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: 'Car not found.' });
    res.json({ success: true, message: 'Car deleted.' });
  });
});


app.post('/api/contact', (req, res) => {
  const { fname, lname, email, phone, subject, car_id, message } = req.body;

  if (!fname || !lname || !email || !subject || !message)
    return res.status(400).json({ error: 'All required fields must be filled.' });

  if (!email.includes('@'))
    return res.status(400).json({ error: 'Invalid email address.' });

  const sql = `INSERT INTO inquiries (fname, lname, email, phone, subject, car_id, message)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [fname, lname, email, phone || null, subject, car_id || null, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: 'Thank you! Your message has been received. We will contact you within 24 hours.'
    });
  });
});

app.get('/api/inquiries', (req, res) => {
  const sql = `
    SELECT i.*, c.name AS car_name, c.brand AS car_brand
    FROM inquiries i
    LEFT JOIN cars c ON i.car_id = c.id
    ORDER BY i.created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, count: results.length, inquiries: results });
  });
});

app.listen(PORT, () => {
  console.log(`🚗 AutoLux server running at http://localhost:${PORT}`);
  console.log(`📂 Open the site at: http://localhost:${PORT}/index.html`);
  console.log(`📋 View inquiries:   http://localhost:${PORT}/api/inquiries`);
});