import { configureStore } from "@reduxjs/toolkit";
import cart from "./cart/cartSlice";
import admin from "./admin/adminSlice";
import order from "./order/orderSlice";
import auth from "./auth/authSlice";
import user from "./user/userSlice";

export const store = configureStore({
    reducer: {
        cart,
        admin,
        order,
        auth,
        user,
    }
});