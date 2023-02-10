const router = require("express").Router();
const { 
    newOrder, 
    getOrders, 
    getOrder, 
    getConfig,
    getUserOrders,
    createPayment, 
    deleteOrder,
    confirmOrder,
} = require("./Controller");
const { isAuth, isAdmin } = require("../utils/middleware");

router.get("/", isAdmin, getOrders);
router.get("/order/:order_id", isAuth, getOrder);
router.get("/config", isAuth, getConfig);
router.get("/user-orders", isAuth, getUserOrders);
router.post("/", isAuth, newOrder);
router.post("/create-payment-intent", isAuth, createPayment);
router.post("/confirm-order/:order_id", isAuth, confirmOrder);
router.delete("/delete-order", isAdmin, deleteOrder);

module.exports = router;