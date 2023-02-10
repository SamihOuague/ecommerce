const router = require('express').Router();
const { signIn, signUp } = require('../api/authentication');
const { isAuth, verifyPKCE } = require("../utils/middleware");
const {
    ping,
    getUser,
    updateProfil,
    deleteProfil,
    forgotPwd,
    resetPwd,
    getConfirmation,
    verifyEmail
} = require("./Controller");


router.post('/login', verifyPKCE, signIn, async (req, res) => {
    const { user_id } = req;
    if (!user_id) return res.status(500).send({success: false, message: "Parameter user_id is missing."});
    try {
        let r = await (await fetch(`http://oauthserver:3000/get-token?user_id=${req.user_id}&role=${req.role}`)).json();
        if (!r || !r.token) return res.status(401).send({ success: false, message: "Generating token failed." });
        return res.send({ success: true, token: r.token });
    } catch {
        return res.status(500).send({ success: false, message: "Server error." });
    }
});

router.post('/register', verifyPKCE, signUp, async (req, res) => {
    const { user_id } = req;
    if (!user_id) return res.status(500).send({success: false, message: "Parameter user_id is missing."});
    try {
        let r = await (await fetch(`http://oauthserver:3000/get-token?user_id=${req.user_id}&role=${req.role}`)).json();
        if (!r || !r.token) return res.status(401).send({ success: false, message: "Generating token failed." });
        return res.status(201).send({ success: true, token: r.token });
    } catch {
        return res.status(500).send({success: false, message: "Server error."});
    }
});
router.post('/forgot-password', verifyPKCE, forgotPwd);
router.put('/reset-pwd', verifyPKCE, resetPwd);
router.put('/update-user', isAuth, verifyPKCE, updateProfil);
router.get('/ping', isAuth, ping);
router.get('/get-user', isAuth, getUser);
router.get('/confirm-email', isAuth, getConfirmation);
router.get('/verify-email', verifyEmail);
router.delete('/delete-user', isAuth, verifyPKCE, deleteProfil);

module.exports = router;
