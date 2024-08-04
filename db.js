const mysql = require("mysql2/promise");

async function connectDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "todoappuser",
    password: process.env.DB_PASSWORD || "2!9Ofq2d1S*$",
    database: process.env.DB_NAME || "todoapp_db",
    port: 3306,
    multipleStatements: true
  });

  shapeDatabase(connection);
  return connection;
}

function shapeDatabase(db) {
  db.query(`CREATE TABLE IF NOT EXISTS todo_items (
  id int(11) NOT NULL AUTO_INCREMENT,
  description mediumtext NOT NULL,
  created_date datetime NOT NULL,
  completed int(11) NOT NULL,
  PRIMARY KEY (id)
);
`);
}

module.exports = connectDB;