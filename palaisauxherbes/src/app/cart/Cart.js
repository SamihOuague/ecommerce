import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showCart, removeQt, addToCart } from "./cartSlice";

export const Cart = () => {
    const { show, cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    return (
        <div className={`cart ${show}`}>
            <div className='cart__filter'></div>
            <div className="cart__elt">
                <div className="cart__elt__header">
                    <h5 className="cart__elt__header--title">Votre Panier</h5>
                    <div className="button" onClick={() => dispatch(showCart())}>
                        <i className="fas fa-times"></i>
                    </div>
                </div>
                <div className="cart__elt__container">
                    {(cart.length === 0) && <p className="cart__elt__container--msg">Votre panier est vide.</p>}
                    {cart.map((value, key) => (
                        <div className="cart__elt__container__product" key={key}>
                            <div className="cart__elt__container__product__img">
                                <img src={`${process.env.REACT_APP_API_URL}/img/images/${value.img}`} alt="Product" className="cart__elt__container__product__img--img"/>
                            </div>
                            <div className="cart__elt__container__product__body">
                                <h5 className="cart__elt__container__product__body--title">{value.title}</h5>
                                <p className="cart__elt__container__product__body--price">{value.price}$</p>
                                <div className="cart__elt__container__product__body__btngroup">
                                    <div className="button" onClick={() => dispatch(removeQt(value.title))}>
                                        <i className="fas fa-minus"></i>
                                    </div>
                                    <div className="cart__elt__container__product__body__btngroup--qt">{value.qt}</div>
                                    <div className="button" onClick={() => dispatch(addToCart({...value, qt: 0}))}>
                                        <i className="fas fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="btn-group">
                    <div className="button" onClick={() => dispatch(showCart())}>
                        CONTINUER VOS ACHATS
                    </div>
                    <Link to="/checkout" onClick={() => dispatch(showCart())} className="button">
                        COMMANDER
                    </Link>
                </div>
            </div>
        </div>
    );
}