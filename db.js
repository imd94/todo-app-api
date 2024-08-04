require('dotenv').config();
const mysql = require("mysql2/promise");

let connectionObject = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  multipleStatements: true
}

if(process.env.NODE_ENV === 'production') {
  async function connectDB() {
    const connection = await mysql.createConnection(connectionObject);
  
    shapeDatabase(connection);
    return connection;
  }

  module.exports = connectDB;
} else {
  async function start() {
    const connection = await mysql.createConnection(connectionObject);

    shapeDatabase(connection);
    module.exports = connection;

    const app = require("./app");
    app.listen(8000);
  }
  
  start();
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