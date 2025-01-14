require('dotenv').config();

const mysql = require('mysql2');

// MySQL database connection using environment variables
const db = mysql.createConnection({
  host: `${process.env.DB_HOST}`,        // Get host from environment variable
  user: `${process.env.DB_USER}`,        // Get user from environment variable
  password: `${process.env.DB_PASSWORD}`, // Get password from environment variable
  database: `${process.env.DB_NAME}`,     // Get database name from environment variable
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = db;

