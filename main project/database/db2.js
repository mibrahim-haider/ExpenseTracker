const mysql = require('mysql2');

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789', // Replace with your MySQL root password
  database: 'ExpenseTracker',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

module.exports = db;