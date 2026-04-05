const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('../db');

const SECRET = 'secretKeyKiddo'; // Replace for production

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  conn.query(sql, [name, cleanEmail, hash], (err) => {
    if (err) return res.status(500).json({ message: 'User already exists or DB error' });
    res.json({ message: 'User registered!' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const inputEmail = email.trim().toLowerCase();
  conn.query('SELECT * FROM users WHERE LOWER(email) = ?', [inputEmail], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful', user_id: user.id });
  });
});

module.exports = router;

