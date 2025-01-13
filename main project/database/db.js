const mysql = require('mysql2');

// MySQL database connection
const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12757427',
  password: 'L2WJTUVVtU', // Replace with your MySQL root password
  database: 'sql12757427',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

module.exports = db;

