const express = require("express");
const app = express();
const cors = require("cors");
const json = require("body-parser").json;
const Elements = require("./elements/Router");

app.use(cors());
app.use(json());
app.use(express.static("public"));
app.use(Elements);

module.exports = app;