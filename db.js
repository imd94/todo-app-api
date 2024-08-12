require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

async function shapeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`CREATE TABLE IF NOT EXISTS todo_items (
      id int(11) NOT NULL AUTO_INCREMENT,
      description mediumtext NOT NULL,
      created_date datetime NOT NULL,
      completed int(11) NOT NULL,
      PRIMARY KEY (id)
    );`);
    connection.release();
  } catch (error) {
    console.error('Error shaping database:', error);
    throw error;
  }
}

async function start() {
  try {
    await shapeDatabase();
    module.exports = pool;
    
    const app = require("./app");

    // Add your routes and middleware here
    // app.get('/', (req, res) => {
    //   res.send('Hello, world!');
    // });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error starting application:', error);
  }
}

start();