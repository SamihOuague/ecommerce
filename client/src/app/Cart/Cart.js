import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, show, setShow, addToCart }) {
    return (
        <div className={`cart ${show}`}>
            <div className='cart__filter'></div>
            <div className="cart__elt">
                <div className="cart__elt__header">
                    <h5 className="cart__elt__header--title">Votre Panier</h5>
                    <div className="button" onClick={() => setShow("hide")}>
                        <i className="fas fa-times"></i>
                    </div>
                </div>
                <div className="cart__elt__container">
                    {(cart.length === 0) && <p className="cart__elt__container--msg">Votre panier est vide.</p>}
                    {cart.map((value, key) => (
                        <div className="cart__elt__container__product" key={key}>
                            <div className="cart__elt__container__product__img">
                                <img src={`${process.env.REACT_APP_API_URL}/img/images/${value.img}`} alt="Product" className="cart__elt__container__product__img--img" />
                            </div>
                            <div className="cart__elt__container__product__body">
                                <h5 className="cart__elt__container__product__body--title">{value.title}</h5>
                                <p className="cart__elt__container__product__body--price">{value.price}$</p>
                                <div className="cart__elt__container__product__body__btngroup">
                                    <div className="button" onClick={() => addToCart(value, -1)}>
                                        <i className="fas fa-minus"></i>
                                    </div>
                                    <div className="cart__elt__container__product__body__btngroup--qt">{value.qt}</div>
                                    <div className="button" onClick={() => addToCart(value)}>
                                        <i className="fas fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="btn-group-sec">
                    <div className="button" onClick={() => setShow("hide")}>
                        CONTINUER VOS ACHATS
                    </div>
                    <Link to="/order" onClick={(e) => {
                        if (!cart.length) e.preventDefault();
                        setShow("hide");
                    }} className={(cart.length) ? "button" : "btn-disabled"}>
                        COMMANDER
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;