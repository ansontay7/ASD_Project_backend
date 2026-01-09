const { Pool } = require('pg'); // Import the pg Pool

// Create a pool of connections to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,         // PostgreSQL username from .env
  host: process.env.DB_HOST,         // PostgreSQL host from .env (Render's internal or external hostname)
  database: process.env.DB_NAME,     // PostgreSQL database name from .env
  password: process.env.DB_PASSWORD, // PostgreSQL password from .env
  port: process.env.DB_PORT || 5432, // Default port for PostgreSQL is 5432
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // SSL for cloud-hosted DBs (Render)
});

(async () => {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log('✅ Connected to the PostgreSQL database!');
    client.release(); // Release the client back to the pool after usage
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);
  }
})();

// Export the pool so other parts of your app can query the database
module.exports = pool;
