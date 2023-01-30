import React, { useEffect, useState } from "react";
import { Filter } from "./components/Filter";
import { Products } from "./components/Products";
import { Resources, Spinner } from "../Resources/Resources";
import { useParams } from "react-router-dom";

function Shop({ addToCart }) {
    const { name, category } = useParams();
    let initialUri = "https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/?page=1";
    if (name && category) initialUri = `https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/category/${name}?page=1`;
    const [ pathUri, setPathUri ] = useState(initialUri);

    useEffect(() => {
        if (name) setPathUri(`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/category/${name}?page=1`);
        else setPathUri(initialUri);
    }, [name, initialUri]);

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
                    <Products data={{prods, rates}} addToCart={addToCart}/>
                </div>
            );
        }} />
    );
}

export default Shop;