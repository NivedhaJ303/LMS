// backend/db.js
const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2024', // use your MySQL password
  database: 'lms'
});

conn.connect(err => {
  if (err) throw err;
  console.log('MySQL connected!');
});

module.exports = conn;
