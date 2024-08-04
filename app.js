const express = require("express");
const app = express();
const routerApi = require('./router-api');
const apiPath = process.env.DB_HOST || '/api';

app.use(express.urlencoded({ extended: false })); // add user submited data (from form) to our request object
app.use(express.json()); // send json data to our request object
app.use(apiPath, routerApi);


module.exports = app;
