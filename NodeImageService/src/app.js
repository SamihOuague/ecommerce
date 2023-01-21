const express = require("express");
const app = express();
const cors = require("cors");
const Elements = require("./elements/Router");

app.use(cors());
app.use(express.json({limit: '40mb'}));
app.use(express.static("public"));
app.use(Elements);

module.exports = app;