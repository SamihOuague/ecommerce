const app = require("./src/app");
const fs = require("fs");
const https = require("https");

let credentials = {
	key: fs.readFileSync("./certificates/key.pem"),
	cert: fs.readFileSync("./certificates/cert.pem"),
}

console.log(credentials);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT);