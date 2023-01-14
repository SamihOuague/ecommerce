let app = require("./src/app");
const fs = require("fs");
const https = require("https");
require("./src/db/mongoose");

let credentials = {
	key: fs.readFileSync("./certificates/key.pem"),
	cert: fs.readFileSync("./certificates/cert.pem"),
}

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT);