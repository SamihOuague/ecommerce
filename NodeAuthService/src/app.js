const express = require('express');
const cors = require('cors');
const app = express();
const Members = require('./members/Router');

app.use(cors());
app.use(express.json());
app.use(Members);
app.get("/get-pkce", async (req, res) => {
    try {
        const { nonce } = req.query;
        if (!nonce) return res.status(400).send({ success: false, message: "Nonce is required." })
        let r = await (await fetch(`http://oauthserver:3000/get-pkce?nonce=${nonce}`)).json();
        if (!r || !r.token) return res.status(401).send({ success: false, message: (r.message) ? r.message : "" });
        return res.send({success: true, token: r.token});
    } catch(e) {
        console.error(e);
        return res.status(500).send({success: false});
    }
});

module.exports = app;