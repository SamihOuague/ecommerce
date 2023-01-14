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

export const pingThunk = createAsyncThunk("auth/ping", async (data) => {
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
    },
    reducers: {
        setRegister: (state, action) => {
            state.register = action.payload;
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerThunk.fulfilled, (state, action) => {
            const { token } = action.payload;
            if (token) state.token = token;
            localStorage.setItem("token", token);
            state.loading = false;
        });

        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const { token } = action.payload;
            if (token) state.token = token;
            localStorage.setItem("token", token);
            state.loading = false;
        });

        builder.addCase(pingThunk.fulfilled, (state, action) => {
            if (action.payload && !action.payload.logged) {
                localStorage.removeItem("token");
                state.token = null;
            }
        });
    }
});

export const { setRegister, logout } = authSlice.actions;

export default authSlice.reducer;