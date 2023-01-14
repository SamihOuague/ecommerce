const router = require("express").Router();
const { newOrder, getOrders, getOrder, getConfig, createPayment } = require("./Controller");
const { isAuth } = require("../utils/allowedUser");

router.get("/", isAuth, getOrders);
router.get("/order/:order_id", isAuth, getOrder);
router.get("/config", getConfig);
router.post("/", newOrder);
router.post("/create-payment-intent", createPayment);

module.exports = router;