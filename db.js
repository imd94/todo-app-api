const mysql = require("mysql2/promise");

async function start() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "todoappuser",
    password: "2!9Ofq2d1S*$",
    database: "todoapp_db",
    multipleStatements: true
  });

  shapeDatabase(connection);
  module.exports = connection;
  const app = require("./app");
  app.listen(process.env.PORT);
}

start();

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
