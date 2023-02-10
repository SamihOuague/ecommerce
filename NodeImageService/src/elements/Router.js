const router = require("express").Router();
const { upload } = require("./Controller");
const { isAdmin } = require("../utils/middleware");

router.post("/upload", isAdmin, upload);

module.exports = router;