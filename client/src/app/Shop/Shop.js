import React, { useEffect, useState } from "react";
import { Filter } from "./components/Filter";
import { Products } from "./components/Products";
import { Resources, Spinner } from "../Resources/Resources";
import { useParams, useSearchParams } from "react-router-dom";

function Shop({ addToCart }) {
    const { name, category } = useParams();
    const [ URLSearchParams ] = useSearchParams();
    const page = URLSearchParams.get("page");
    let initialUri = `${process.env.REACT_APP_API_URL}/product/?page=${page}`;
    if (name && category) initialUri = `${process.env.REACT_APP_API_URL}/product/category/${name}?page=${page}`;
    const [ pathUri, setPathUri ] = useState(initialUri);

    useEffect(() => {
        if (name) setPathUri(`${process.env.REACT_APP_API_URL}/product/category/${name}?page=${page}`);
        else setPathUri(pathUri);
    }, [name, pathUri, page]);

    return (
        <Resources path={pathUri} render={(data) => {
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
                    <Filter data={{cat, nb_prod, highestPrice}} setPathUri={setPathUri} pathUri={pathUri}/>
                    <Products data={{prods, rates}} addToCart={addToCart} name={name} category={category}/>
                </div>
            );
        }} />
    );
}

export default Shop;