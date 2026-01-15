const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use parameterized queries with $1 placeholder for PostgreSQL
    const { rows: users } = await db.query(
      'SELECT user_id, name, role, password FROM users WHERE email = $1',
      [email]  // $1 corresponds to the email parameter
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // 🔐 Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      user_id: user.user_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2️⃣ Check if user already exists
    const { rows: existingUsers } = await db.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Insert new user
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, role',
      [name, email, hashedPassword, 'user'] // default role = 'user'
    );

    const newUser = rows[0];

    // 5️⃣ Optional: generate token immediately after registration
    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        role: newUser.role,
        name: newUser.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user_id: newUser.user_id,
      role: newUser.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

