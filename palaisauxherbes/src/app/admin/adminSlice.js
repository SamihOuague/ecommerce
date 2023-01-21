import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getMain = async () => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/`)).json()
};

const addCategory = async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    })).json();
};

const addSubCategory = async (url, data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/category/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify(data)
    })).json();
};

const uploadPic = async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3002/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
    })).json();
};

const addProduct = async (data) => {
    let response = await uploadPic({img: data.img});
    if (!response.message) return response; 
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify({...data, img: response.message}),
    })).json();
};

export const addProductThunk = createAsyncThunk("admin/addProduct", async (data) => {
    let response = await addProduct(data);
    return response;
});

export const addSubCategoryThunk = createAsyncThunk("admin/addSubCategory", async (data) => {
    let response = await addSubCategory(data.url, data.body);
    return response;
});

export const getMainThunk = createAsyncThunk("admin/main", async () => {
    let response = await getMain();
    return response;
});

export const addCategoryThunk = createAsyncThunk("admin/addCategory", async (data) => {
    let response = await addCategory(data);
    return response;
});

export const deleteCategoryThunk = createAsyncThunk("admin/deleteCategory", async (name) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/category`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify({name}),
    })).json();
});

export const deleteSubCategoryThunk = createAsyncThunk("admin/deleteSubCategory", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/category/${data.category}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify({name: data.name}),
    })).json();
});

export const deleteProductThunk = createAsyncThunk("admin/deleteProduct", async (name) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        },
        body: JSON.stringify({name}),
    })).json();
});

export const getOrdersThunk = createAsyncThunk("admin/getOrders", async () => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3004/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ` + localStorage.getItem("token"),
        }
    })).json();
});

export const deleteOrderThunk = createAsyncThunk("admin/deleteOrder", async (data) => {
    const response = await (await fetch(`https://${process.env.REACT_APP_API_URL}:3004/delete-order`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    })).json();
    return response;
});

export const adminSlice = createSlice({
    name: "admin",
    initialState: {
        categories: null,
        products: null,
        orders: [],
        notAdmin: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getMainThunk.fulfilled, (state, action) => {
            state.categories = action.payload.cat;
            state.products = action.payload.prods;
        }).addCase(getMainThunk.rejected, (state) => {
            state.categories = [];
        });

        builder.addCase(addCategoryThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id && state.categories) state.categories.push(action.payload); 
            else if (action.payload.is_admin === false) state.notAdmin = true;
        });

        builder.addCase(addSubCategoryThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) {
                let c = state.categories.find((v) => {
                    return v.category === action.payload.category;
                });
                c.subcategory = action.payload.subcategory;
            } else if (action.payload.is_admin === false) state.notAdmin = true;
        });
        
        builder.addCase(addProductThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.products.push(action.payload);
            else if (action.payload.is_admin === false) state.notAdmin = true;
        });

        builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
            if (action.payload) state.orders = action.payload; 
            state.notAdmin = action.payload.is_admin === false;
        });

        builder.addCase(deleteOrderThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.orders = state.orders.filter((v) => v._id !== action.payload._id);
            else if (action.payload.is_admin === false) state.notAdmin = true;
        });

        builder.addCase(deleteCategoryThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.categories = state.categories.filter((v) => v._id !== action.payload._id);
            else if (action.payload.is_admin === false) state.notAdmin = true;
        });

        builder.addCase(deleteSubCategoryThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) {
                let t = state.categories.find((v) => v._id === action.payload._id);
                t.subcategory = action.payload.subcategory;
            } else if (action.payload.is_admin === false) state.notAdmin = true;
        });

        builder.addCase(deleteProductThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.products = state.products.filter((v) => v._id !== action.payload._id);
            else if (action.payload.is_admin === false) state.notAdmin = true;
        });
    }
});

export default adminSlice.reducer;