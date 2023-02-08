import React from "react";
import { Filter } from "./components/Filter";
import { Products } from "./components/Products";
import { Resources, Spinner } from "../Resources/Resources";
import { useParams, useSearchParams } from "react-router-dom";

function Shop({ addToCart }) {
    const { category } = useParams();
    const [URLSearchParams] = useSearchParams();
    const prodFilter = { 
        page: URLSearchParams.get("page"), 
        pricemin: URLSearchParams.get("pricemin"), 
        pricemax: URLSearchParams.get("pricemax"),
        available: URLSearchParams.get("available"),
    };

    const handleFilterUri = (f) => {
        let filterUriArray = [];
        let filterUri = "";
        for (let i = 0, filterKeys = Object.keys(f); i < filterKeys.length; i++)
            if (f[filterKeys[i]]) filterUriArray.push(`${filterKeys[i]}=${f[filterKeys[i]]}`);
        for (let i = 0; i < filterUriArray.length; i++) {
            if (i === 0) filterUri += "?"
            filterUri += filterUriArray[i];
            if (i !== filterUriArray.length - 1) filterUri += "&";
        }
        return filterUri;
    }
    
    const initialUri = `${process.env.REACT_APP_API_URL}:3003${window.location.pathname.replace(`${category}/`, '')}${handleFilterUri(prodFilter)}`;
    return (
        <Resources path={initialUri} render={(data) => {
            if (data.loading) return <Spinner />;
            else if (data.errorCode || !data.payload) {
                return (
                    <div className="shop">
                        <h2>ERROR - 500</h2>
                    </div>
                );
            }
            const { cat, prods, rates, nb_prod, highestPrice } = data.payload;
            return (
                <div className="shop">
                    <Filter data={{ cat, nb_prod, highestPrice }} prodFilter={prodFilter} handleGetFilterUri={handleFilterUri} />
                    <Products data={{ prods, rates }} addToCart={addToCart} />
                </div>
            );
        }} />
    );
}

export default Shop;