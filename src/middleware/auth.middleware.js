const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  console.log('🔐 Auth middleware start');

  const authHeader = req.headers.authorization;
  console.log('📨 Authorization header:', authHeader);

  if (!authHeader) {
    console.log('❌ No auth header');
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('❌ Malformed auth header');
    return res.status(401).json({ message: 'Malformed token' });
  }

  const token = parts[1];
  console.log('🔑 Token extracted');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('❌ JWT verification failed');
      console.error('JWT error:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('✅ JWT verified');
    console.log('👤 Decoded user:', decoded);

    req.user = decoded;
    console.log('➡️ Calling next()');
    next();
  });
};
