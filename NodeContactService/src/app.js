const express = require("express");
const cors = require("cors");
const contact = require("./contact/Router");
const app = express();

app.use(cors());
app.use(express.json());
app.use(contact);

module.exports = app;