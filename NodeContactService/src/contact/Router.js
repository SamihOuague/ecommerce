const router = require("express").Router();
const { getMessages, getMessage, sendMessage } = require("./Controller");

router.get("/", getMessages);
router.get("/:id", getMessage);
router.post("/", sendMessage), 

module.exports = router;