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
