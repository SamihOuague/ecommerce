const express = require("express");
const cors = require("cors");
const order = require("./orders/Router");

let app = express();

app.use(cors());
app.use(express.json());
app.use(order);

module.exports = app;