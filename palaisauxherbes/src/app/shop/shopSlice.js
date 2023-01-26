import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getMain = async (page = 1) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/product/?page=${page}`)).json();
}

const getByCat = async (tag, page = 1) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/product/category/${tag}?page=${page}`)).json();
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
    return await (await fetch(`${process.env.REACT_APP_API_URL}/product/?page=${data.page}&available=${data.filter}`)).json();
});

export const fetchPriceIntervalThunk = createAsyncThunk("shop/getPriceInterval", async (data) => {
    let params = `?page=${data.page}`;
    if (data.filter.min) params += `&pricemin=${data.filter.min}`;
    if (data.filter.max) params += `&pricemax=${data.filter.max}`;
    return await (await fetch(`${process.env.REACT_APP_API_URL}/product/${params}`)).json();
});

export const fetchSortBy = createAsyncThunk("shop/sortBy", async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/product/?page=${data.page}&sortby=${data.sortby}`)).json();
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
        highestPrice: 0,
        openNav: false,
        sortb: "main",
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
            if (!state.availableCheckBox.in) {
                state.availableCheckBox.in = !state.availableCheckBox.in;
                state.availableCheckBox.out = !state.availableCheckBox.in;
            }
        },
        availableOut: (state) => {
            if (!state.availableCheckBox.out) {
                state.availableCheckBox.out = !state.availableCheckBox.out;
                state.availableCheckBox.in = !state.availableCheckBox.out;
            }
        },
        availableClear: (state) => {
            state.availableCheckBox = {
                in: false,
                out: false,
            }
        },
        setIntervalPrice: (state, action) => {
            state.priceInterval = action.payload;
        },
        setOpenNav: (state, action) => {
            state.openNav = action.payload;
        },
        setSortB: (state, action) => {
            state.sortb = action.payload; 
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMainThunk.fulfilled, (state, action) => {
            state.categories = action.payload.cat;
            state.products = action.payload.prods;
            state.availableCount = action.payload.nb_prod;
            state.rates = action.payload.rates;
            state.highestPrice = action.payload.highestPrice.price;
            state.loading = false;
        }).addCase(getMainThunk.pending, (state) => {
            state.loading = true;
        });
         
        builder.addCase(getByCatThunk.fulfilled, (state, action) => {
            state.categories = action.payload.cat;
            state.products = action.payload.prods;
            state.highestPrice = action.payload.highestPrice.price;
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
            state.loading = true;
        });

        builder.addCase(fetchSortBy.fulfilled, (state, action) => {
            state.products = action.payload.prods;
            state.loading = false;
        }).addCase(fetchSortBy.pending, (state) => {
            state.loading = true;
        });
    }
});

export const { showcat, availableIn, availableOut, availableClear, setIntervalPrice, setOpenNav, setSortB } = shopSlice.actions;

export default shopSlice.reducer;