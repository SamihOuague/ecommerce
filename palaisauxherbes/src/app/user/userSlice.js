import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getInfosThunk = createAsyncThunk("user/getInfos", async () => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/get-user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        }
    })).json();
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        infos: null
    },
    extraReducers: (builder) => {
        builder.addCase(getInfosThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.infos = action.payload;
        });
    }
});

export default userSlice.reducer;