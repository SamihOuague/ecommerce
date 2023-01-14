const router = require("express").Router();
const { upload } = require("./Controller");
const { isAuth } = require("../utils/allowedUser");

router.post("/upload", isAuth, upload);

module.exports = router;