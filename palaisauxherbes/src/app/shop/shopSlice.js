import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getMain = async (page = 1) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/?page=${page}`)).json();
}

const getByCat = async (tag, page = 1) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/category/${tag}?page=${page}`)).json();
}

export const getByCatThunk = createAsyncThunk("shop/getByCat", async (data) => {
    let response = await getByCat(data.name, data.page);
    return response;
});

export const getMainThunk = createAsyncThunk("shop/main", async (page = 1) => {
    let response = await getMain(page);
    return response;
});

export const fetchAvailableThunk = createAsyncThunk("shop/getAvailable", async (data) => {
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/?page=${data.page}&available=${data.filter}`)).json();
});

export const fetchPriceIntervalThunk = createAsyncThunk("shop/getPriceInterval", async (data) => {
    let params = `?page=${data.page}`;
    if (data.filter.min) params += `&pricemin=${data.filter.min}`;
    if (data.filter.max) params += `&pricemax=${data.filter.max}`;
    return await (await fetch(`https://${process.env.REACT_APP_API_URL}:3003/${params}`)).json();
});

const shopSlice = createSlice({
    name: "shop",
    initialState: {
        products: null,
        categories: null,
        availableCheckBox: {
            in: false,
            out: false
        },
        availableCount: {
            in: 0,
            out: 0,
        },
        priceInterval: {
            min: "",
            max: ""
        },
        rates: {},
        loading: true,
    },
    reducers: {
        showcat: (state, action) => {
            let cat = state.categories.find((value) => {
                return value.category === action.payload;
            });
            if (cat) {
                if (cat.show === "") cat.show = "showcate";
                else cat.show = (cat.show === "showcate") ? "hidecate" : "showcate";
            }
        },
        availableIn: (state) => {
            state.availableCheckBox.in = !state.availableCheckBox.in;
            state.availableCheckBox.out = !state.availableCheckBox.in;
        },
        availableOut: (state) => {
            state.availableCheckBox.out = !state.availableCheckBox.out;
            state.availableCheckBox.in = !state.availableCheckBox.out;
        },
        availableClear: (state) => {
            state.availableCheckBox = {
                in: false,
                out: false,
            }
        },
        setIntervalPrice: (state, action) => {
            state.priceInterval = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMainThunk.fulfilled, (state, action) => {
            state.categories = action.payload.cat;
            state.products = action.payload.prods;
            state.availableCount = action.payload.nb_prod;
            state.rates = action.payload.rates;
            state.loading = false;
        }).addCase(getMainThunk.pending, (state) => {
            state.loading = true;
        });
         
        builder.addCase(getByCatThunk.fulfilled, (state, action) => {
            state.categories = action.payload.cat;
            state.products = action.payload.prods;
            state.loading = false;
        }).addCase(getByCatThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchAvailableThunk.fulfilled, (state, action) => {
            state.products = action.payload.prods;
            state.loading = false;
        }).addCase(fetchAvailableThunk.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchPriceIntervalThunk.fulfilled, (state, action) => {
            state.products = action.payload.prods;
            state.loading = false;
        }).addCase(fetchPriceIntervalThunk.pending, (state) => {
            state.loading = false;
        });
    }
});

export const { showcat, availableIn, availableOut, availableClear, setIntervalPrice } = shopSlice.actions;

export default shopSlice.reducer;