import React from "react";
import { Resources, Spinner } from "../Resources/Resources";
import { useParams } from "react-router-dom";
import { ProductContainer, ProductInfos, ProductRecommended } from "./components/ProductContainer"
function Product() {
    const { category, name } = useParams();
    return (
        <Resources path={`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/${category}/${name}`} render={(data) => {
            if (data.loading) return <Spinner />;
            else if (data.errorCode || !data.payload) {
                return (
                    <div className="shop">
                        <h2>ERROR - 500</h2>
                    </div>
                );
            }
            const { prod, recommended, rates } = data.payload;
            return (
                <div className="product">
                    <ProductContainer prod={prod} />
                    <ProductInfos prod={prod} />
                    <ProductRecommended recommended={recommended} rates={rates}/>
                </div>
            );
        }} />
    );
}

export default Product;