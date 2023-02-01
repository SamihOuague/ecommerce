import React from "react";
import { Resources, Spinner } from "../Resources/Resources";
import { useParams } from "react-router-dom";
import { ProductContainer, ProductInfos, ProductRecommended } from "./components/ProductContainer";

function Product({ addToCart }) {
    const { category, name } = useParams();
    
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}/product/${category}/${name}`} render={(data) => {
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
                    <ProductContainer prod={prod} addToCart={addToCart}/>
                    <ProductInfos prod={prod} />
                    <ProductRecommended recommended={recommended} rates={rates}/>
                </div>
            );
        }} />
    );
}

export default Product;