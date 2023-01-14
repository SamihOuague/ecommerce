import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getProduct = async (category, product) => {
    let c = category.replace(" ", "-").toLowerCase();
    let p = product.replace(" ", "-").toLowerCase();
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/${c}/${p}`)).json();
}

export const getProductThunk = createAsyncThunk("product/get", async (data) => {
    let response = await getProduct(data.category, data.name);
    return response;
});

export const postReviewThunk = createAsyncThunk("product/review", async (data) => {
    let response = await (await fetch(`https://${process.env.REACT_APP_API_URL}:3005/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
    })).json();
    return response;
});

export const getReviewsThunk = createAsyncThunk("product/getReview", async (id_product) => {
    let response = await (await fetch(`https://${process.env.REACT_APP_API_URL}:3005/${id_product}`)).json();
    return response;
});

export const productSlice = createSlice({
    name: "product",
    initialState: {
        product: null,
        qt: 1,
        showReviews: false,
        score: 0,
        comments: [],
        recommended: [],
        rates: []
    },
    reducers: {
        addQt: (state) => {
            state.qt += 1;
        },
        removeQt: (state) => {
            if (state.qt > 1) state.qt -= 1;
        },
        setShowReviews: (state, action) => {
            if ((typeof action.payload) === "boolean") state.showReviews = action.payload;
            else state.showReviews = false;
        },
        setScore: (state, action) => {
            state.score = action.payload;
        },
        postReview: (state, action) => {
            if (action.payload) state.comments.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProductThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload.prod) state.product = action.payload.prod;
            if (action.payload && action.payload.recommended) state.recommended = action.payload.recommended;
            if (action.payload && action.payload.rates) state.rates = action.payload.rates;
        }).addCase(getProductThunk.pending, (state) => {
            state.product = null;
        });

        builder.addCase(postReviewThunk.fulfilled, (state, action) => {
            if (action.payload && action.payload._id) state.comments.unshift(action.payload); 
        });

        builder.addCase(getReviewsThunk.fulfilled, (state, action) => {
            if (action.payload) {
                state.comments = action.payload;
                state.showReviews = true;
            }
        });
    }
});

export const { addQt, removeQt, setShowReviews, setScore, postReview } = productSlice.actions;

export default productSlice.reducer;