const express = require("express");
const cors = require("cors");
const app = express();
const review = require("./review/Router");

app.use(cors());
app.use(express.json());
app.use(review);

module.exports = app;