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

export const updateInfosThunk = createAsyncThunk("user/updateInfos", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/update-user`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
    })).json();
});

export const deleteInfosThunk = createAsyncThunk("user/deleteInfos", async () => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3001/delete-user`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        }
    })).json();
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        infos: null,
        edit: false,
    },
    reducers: {
        setEditMode: (state, action) => {
            state.edit = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getInfosThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.infos = action.payload;
        });

        builder.addCase(updateInfosThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) {
                state.infos = action.payload;
                state.edit = false;
            }
        });

        builder.addCase(deleteInfosThunk.fulfilled, () => {
            localStorage.removeItem("token");
        });
    }
});

export const { setEditMode } = userSlice.actions;

export default userSlice.reducer;