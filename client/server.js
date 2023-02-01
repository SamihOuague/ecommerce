const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const https = require("https");

let credentials = {
	key: fs.readFileSync("./certificates/key.pem"),
	cert: fs.readFileSync("./certificates/cert.pem"),
	passphrase: "test123"
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
	return res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443);