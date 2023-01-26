import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerThunk = createAsyncThunk("auth/register", async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const loginThunk = createAsyncThunk("auth/login", async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const forgotPwdThunk = createAsyncThunk("auth/forgotPwd", async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const resetPwdThunk = createAsyncThunk("auth/resetPwd", async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-pwd`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

export const pingThunk = createAsyncThunk("auth/ping", async () => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/auth/ping`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
    })).json();
});

export const verifyEmailThunk = createAsyncThunk("auth/verify", async (url_token) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-email?url_token=${url_token}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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
        },
        setMsg: (state, action) => {
            state.msg = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerThunk.fulfilled, (state, action) => {
            const { token, message } = action.payload;
            state.msg = "";
            if (token) state.token = token;
            else if (message) state.msg = message;
            localStorage.setItem("token", token);
            state.loading = false;
        }).addCase(registerThunk.pending, (state) => {
            state.loading = true;
        }).addCase(registerThunk.rejected, (state) => {
            state.msg = "Error 500 -";
        });

        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const { token, message } = action.payload;
            state.msg = "";
            if (token) state.token = token;
            else if (message) state.msg = message;
            localStorage.setItem("token", token);
            state.loading = false;
        }).addCase(loginThunk.pending, (state) => {
            state.loading = true;
        }).addCase(loginThunk.rejected, (state) => {
            state.msg = "Error 500 -";
        });

        builder.addCase(pingThunk.fulfilled, (state, action) => {
            if (action.payload && !action.payload.logged) {
                localStorage.removeItem("token");
                state.token = null;
            }
        });

        builder.addCase(forgotPwdThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload.msg) state.msg = "Email sent, check also in the spam mails.";
            else state.msg = "Email not found !";
            state.loading = false;
        }).addCase(forgotPwdThunk.pending, (state) => {
            state.loading = true;
        }).addCase(forgotPwdThunk.rejected, (state) => {
            state.msg = "Email not found !";
            state.loading = false;
        });

        builder.addCase(resetPwdThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id)
                state.redirect = true;
            state.loading = false;
        }).addCase(resetPwdThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(verifyEmailThunk.fulfilled, (state, action) => {
            if (action.payload) {
                if (action.payload.confirmed) {
                    state.loading = false;
                    state.redirect = true;
                } else if (action.payload.msg) state.msg = action.payload.msg;
                else state.msg = "Confirmation failed !"
            }
        }).addCase(verifyEmailThunk.pending, (state) => {
            state.loading = true;
        }).addCase(verifyEmailThunk.rejected, (state) => {
            state.loading = false;
            state.msg = "Error 500 - Confirmation failed";
        });
    }
});

export const { setRegister, logout, setResetPwd, setMsg } = authSlice.actions;

export default authSlice.reducer;