import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendMsgThunk = createAsyncThunk("contact/send", async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/contact/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })).json();
});

const contactSlice = createSlice({
    name: "contact",
    initialState: {
        loading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(sendMsgThunk.fulfilled, (state) => {
            state.loading = false;
        }).addCase(sendMsgThunk.pending, (state) => {
            state.loading = true;
        });
    }
});

export default contactSlice.reducer;