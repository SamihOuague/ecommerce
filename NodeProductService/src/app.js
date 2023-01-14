const express = require('express');
const cors = require('cors');
const app = express();
const products = require('./products/Router');

app.use(cors());
app.use(express.json());
app.use(products);

module.exports = app;