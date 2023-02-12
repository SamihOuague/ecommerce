const router = require("express").Router();
const { getComments, postComment, deleteComment } = require("./Controller");
const { isAuth, isAdmin } = require("../utils/middleware");

router.get("/:id", getComments);
router.post("/", isAuth, postComment);
router.delete("/:id", isAdmin, deleteComment);

module.exports = router;