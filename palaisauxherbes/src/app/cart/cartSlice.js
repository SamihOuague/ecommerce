import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        show: "",
        cart: (localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [],
        locked: false,
    },
    reducers: {
        showCart: (state) => {
            if (!state.locked) {
                if (state.show === "") state.show = "show";
                else state.show = (state.show === "show") ? "hide" : "show";
            }
        },
        removeQt: (state, action) => {
            if (!state.locked) {
                let c = state.cart.find((value) => {
                    return value.title === action.payload;
                });
                if (c && c.qt > 1) c.qt -= 1;
                else if (c && c.qt <= 1) {
                    state.cart = state.cart.filter((value) => {
                        return value.title !== action.payload;
                    });
                }
                localStorage.setItem("cart", JSON.stringify(state.cart));
            }
        },
        addToCart: (state, action) => {
            if (!state.locked) {
                let c = state.cart.find((value) => {
                    return value.title === action.payload.title;
                });
                if (c) {
                    if (action.payload.qt) c.qt += action.payload.qt;
                    else c.qt += 1;
                }
                else state.cart.push({ ...action.payload });
                localStorage.setItem("cart", JSON.stringify(state.cart));
                state.show = "show";
            }
        },
        setLocked: (state, action) => {
            state.locked = action.payload;
            if (action.payload) state.show = "hide";
        }
    }
});

export const { showCart, removeQt, addToCart, setLocked } = cartSlice.actions;

export default cartSlice.reducer;