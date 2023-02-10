import React, { useState } from "react";
import { ProductForm } from "./ProductForms";

const ProductComponent = ({product}) => {
    return (
        <div className="admin__container__products__product">
            <h3>{product.title}</h3>
            <p>{product.price}$</p>
        </div>
    );
}

function Product({ products, categories }) {
    const [ showForm, setShowForm ] = useState(false);
    return (
        <div className="admin__container">
            <div className="btn-group">
                <button className="button" onClick={() => setShowForm(true)}>Add Product</button>
            </div>
            <div className="admin__container__products">
                {(showForm) && <ProductForm setShowForm={setShowForm} categoryList={categories}/>}
                {products.map((value, key) => (
                    <ProductComponent product={value} key={key}/>
                ))}
            </div>
        </div>
    );
}

export default Product;