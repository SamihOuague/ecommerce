const router = require("express").Router();
const { ping, getAccessToken } = require("./Controller");
const { verifyPKCEToken, getPKCEToken } = require("./middleware/pkce");

router.get("/ping", ping);
router.get("/get-pkce", getPKCEToken);
router.post("/verify-pkce", verifyPKCEToken, (req, res) => {
    return res.send({success: true});
});
router.get("/get-token", getAccessToken);

module.exports = router;