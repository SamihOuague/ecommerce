import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const postOrderThunk = createAsyncThunk("order/post", async (data) => {
    const response = await (await fetch(`https://${process.env.REACT_APP_API_URL}:3004/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    })).json();
    return response;
});

export const getConfigThunk = createAsyncThunk("order/getConfig", async () => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3004/config`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        }
    })).json();
});

export const paymentIntentThunk = createAsyncThunk("order/paymentIntent", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3004/create-payment-intent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    })).json();
});

export const confirmOrderThunk = createAsyncThunk("order/confirmOrder", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3004/confirm-order/${data.order_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
    })).json();
});

const orderSlice = createSlice({
    name: "order",
    initialState: {
        cart: [],
        redirect: false,
        msg: "",
        loading: true,
        publishableKey: null,
        clientSecret: "",
        amount: 0,
        orderStatus: null,
        shippingInfos: null,
    },
    reducers: {
        setShippingInfos: (state, action) => {
            const { firstname, lastname, phoneNumber, address, zipcode, city } = action.payload;
            if (firstname && lastname && phoneNumber && address && zipcode && city) {
                state.shippingInfos = action.payload;
            }
        },
        resetShippingInfos: (state) => {
            state.shippingInfos = null;
            state.publishableKey = null;
            state.clientSecret = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(postOrderThunk.fulfilled, (state, action) => {
            if (action.payload.msg) state.msg = action.payload.msg;
            else if (action.payload._id) { 
                state.redirect = true;
            };
        }).addCase(postOrderThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getConfigThunk.fulfilled, (state, action) => {
            const { publishableKey } = action.payload;
            if (publishableKey) state.publishableKey = publishableKey;
            state.loading = false;
        }).addCase(getConfigThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(paymentIntentThunk.fulfilled, (state, action) => {
            const { clientSecret, cart, amount } = action.payload;
            if (clientSecret && cart && amount) {
                state.clientSecret = clientSecret;
                state.amount = amount;
                state.cart = cart;
            }
            state.loading = false;
        }).addCase(paymentIntentThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(confirmOrderThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload.confirmed) state.orderStatus = action.payload.confirmed;
            state.loading = false;
        }).addCase(confirmOrderThunk.pending, (state) => {
            state.loading = true;
        });
    }
});

export const { setShippingInfos, resetShippingInfos } = orderSlice.actions;

export default orderSlice.reducer;