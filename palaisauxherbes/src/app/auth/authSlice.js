import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerThunk = createAsyncThunk("auth/register", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const loginThunk = createAsyncThunk("auth/login", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const forgotPwdThunk = createAsyncThunk("auth/forgotPwd", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const resetPwdThunk = createAsyncThunk("auth/resetPwd", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/reset-pwd`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const pingThunk = createAsyncThunk("auth/ping", async () => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/ping`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
    })).json();
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        register: false,
        token: localStorage.getItem("token"),
        loading: false,
        resetPwd: false,
        reset_token: null,
        msg: "",
        redirect: false,
    },
    reducers: {
        setRegister: (state, action) => {
            state.register = action.payload;
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        },
        setResetPwd: (state, action) => {
            state.resetPwd = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerThunk.fulfilled, (state, action) => {
            const { token } = action.payload;
            if (token) state.token = token;
            localStorage.setItem("token", token);
            state.loading = false;
        }).addCase(registerThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const { token } = action.payload;
            if (token) state.token = token;
            localStorage.setItem("token", token);
            state.loading = false;
        }).addCase(loginThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(pingThunk.fulfilled, (state, action) => {
            if (action.payload && !action.payload.logged) {
                localStorage.removeItem("token");
                state.token = null;
            }
        });

        builder.addCase(forgotPwdThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload.msg) state.msg = "Email sent, check also in the spam mails.";
        });

        builder.addCase(resetPwdThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload.id)
                state.redirect = true;
        });
    }
});

export const { setRegister, logout, setResetPwd } = authSlice.actions;

export default authSlice.reducer;