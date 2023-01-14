const router = require("express").Router();
const { getComments, postComment, deleteComment } = require("./Controller");
const { isAuth } = require("../utils/allowedUser");

router.get("/:id", getComments);
router.post("/", isAuth, postComment);
router.delete("/:id", isAuth, deleteComment);

module.exports = router;