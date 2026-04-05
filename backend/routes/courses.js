const express = require('express');
const router = express.Router();
const conn = require('../db');

// Get all courses
router.get('/', (req, res) => {
  conn.query('SELECT * FROM courses', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// Enroll student in a course
router.post('/enroll', (req, res) => {
  const { user_id, course_id } = req.body;
  const sql = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
  conn.query(sql, [user_id, course_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to enroll' });
    res.json({ success: true, message: 'Enrollment successful!' });
  });
});

// Get all courses a user is enrolled in
router.get('/mycourses/:user_id', (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT c.* FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_id = ?
  `;
  conn.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    res.json(results);
  });
});

module.exports = router;

module.exports = router;
