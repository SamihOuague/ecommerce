const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
	return res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(3006);