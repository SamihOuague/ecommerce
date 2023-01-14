import { configureStore } from "@reduxjs/toolkit";
import shop from "./shop/shopSlice";
import cart from "./cart/cartSlice";
import admin from "./admin/adminSlice";
import product from "./product/productSlice";
import order from "./order/orderSlice";
import auth from "./auth/authSlice";
import user from "./user/userSlice";

export const store = configureStore({
    reducer: {
        shop,
        cart,
        admin,
        product,
        order,
        auth,
        user,
    }
});