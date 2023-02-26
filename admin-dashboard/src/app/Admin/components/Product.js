import React, { useState } from "react";
import { ProductForm } from "./ProductForms";
import { SubmitComponent, PKCEComponent } from "../../PKCE/PKCEComponents";

const DeletePop = ({ setPopup, popup }) => {
    const [ dataForm, setDataForm ] = useState();
    const handleDeleteCategory = (e) => {
        e.preventDefault();
        const { token, nonce, name } = e.target;
        const data = {
            token: token.value,
            nonce: nonce.value,
            name: name.value,
        }
        if (data.name) setDataForm(data);
    }

    return (
        <div className="popup">
            <form className="popup__container" onSubmit={(e) => handleDeleteCategory(e)}>
                <h2 className="popup__container--title">Supprimer <span onClick={() => setPopup(false)}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>Cette action est irreversible, voulez vous continuer ?</p>
                <input type="text" defaultValue={popup} name="name" disabled/>
                <PKCEComponent />
                <SubmitComponent
                    btnValue={"Supprimer"}
                    path={`${process.env.REACT_APP_API_URL}/product/`}
                    method="DELETE"
                    dataForm={dataForm}
                    redirectTo={"/redirect?url=/"}
                />
                <button className="button btn-danger" onClick={() => setPopup(false)}>Annuler</button>
            </form>
        </div>
    );
}

const ProductComponent = ({ product, setPopup, setProductEdit }) => {
    return (
        <div className="shop__overview__container__card">
            <div className="shop__overview__container__card__info">
                <img className="shop__overview__container__card__info--pic" src={`${process.env.REACT_APP_API_URL}/image/images/${product.img}`} alt="Product pic" />
                <div className="container_sec">
                    <p className="shop__overview__container__card__info--tag">{product.categoryTag}</p>
                    <h3 className="shop__overview__container__card__info--title">{product.title}</h3>
                    <div className="shop__overview__container__card__info__stars">
                        {/*[1, 2, 3, 4, 5].map((v, k) => (
                            <i className={`${(v <= rates[product._id]) ? 'fa-solid' : 'fa-regular'} fa-star`} key={k}></i>
                        ))*/}
                    </div>
                    <div className="shop__overview__container__card__info--price">
                        <p>{product.price}$</p>
                    </div>
                    <div className="btn-group">
                        <button className="button" onClick={() => setProductEdit(product)}>Edit Product</button>
                        <button className="button btn-danger" onClick={() => setPopup(product.title)}>Delete Product</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Product({ products, categories }) {
    const [showForm, setShowForm] = useState(false);
    const [ popup, setPopup ] = useState(false);
    const [ productEdit, setProductEdit ] = useState(null);
    return (
        <div className="admin__container">
            <div className="btn-group">
                <button className="button" onClick={() => setShowForm(true)}>Add Product</button>
            </div>
            {(showForm) && <ProductForm setShowForm={setShowForm} categoryList={categories} productEdit={productEdit}/>}
            <div className="shop__overview__container">
                {products.map((value, key) => (
                    <ProductComponent product={value} key={key} setPopup={setPopup} setProductEdit={setProductEdit} />
                ))}
            </div>
            {(popup) && <DeletePop popup={popup} setPopup={setPopup} />}
        </div>
    );
}

export default Product;