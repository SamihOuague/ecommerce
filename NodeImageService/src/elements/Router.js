const router = require("express").Router();
const { upload } = require("./Controller");
const { isAdmin } = require("../utils/allowedUser");

router.post("/upload", isAdmin, upload);

module.exports = router;