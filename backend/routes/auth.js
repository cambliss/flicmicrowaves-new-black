require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  let valid = false;
  let role = '';

  if (username === process.env.ADMIN_USER) {
    valid = await bcrypt.compare(password, process.env.ADMIN_PASS_HASH);
    role = 'admin';
  } else if (username === process.env.INVENTORY_USER) {
    valid = await bcrypt.compare(password, process.env.INVENTORY_PASS_HASH);
    role = 'inventory';
  }

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

module.exports = router;
