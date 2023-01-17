const router = require("express").Router();
const { 
    newOrder, 
    getOrders, 
    getOrder, 
    getConfig,
    getUserOrders,
    createPayment, 
    deleteOrder,
} = require("./Controller");
const { isAuth, isAdmin } = require("../utils/allowedUser");

router.get("/", isAdmin, getOrders);
router.get("/order/:order_id", isAuth, getOrder);
router.get("/config", isAuth, getConfig);
router.get("/user-orders", isAuth, getUserOrders);
router.post("/", isAuth, newOrder);
router.post("/create-payment-intent", isAuth, createPayment);
router.delete("/delete-order", isAdmin, deleteOrder);

module.exports = router;