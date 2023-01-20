import React, { useEffect } from "react";
import { Shop } from "./app/shop/Shop";
import { Cart } from "./app/cart/Cart";
import { Product } from "./app/product/Product";
import { Admin } from "./app/admin/Admin";
import { Contact } from "./app/contact/Contact";
import Order from "./app/order/Order";
import Auth from "./app/auth/Auth";
import CGU from "./app/CGU/CGU";
import User from "./app/user/AutoComplete";
import ResetPwd from "./app/auth/ResetPwd";
import SuccessOrder from "./app/order/Success"; 
import EmailConfirm from "./app/auth/EmailConfirm";
import { useDispatch, useSelector } from "react-redux";
import { showCart } from "./app/cart/cartSlice";
import { Routes, Route, Link } from "react-router-dom";
import { pingThunk } from "./app/auth/authSlice";
import './App.css'

function App() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(pingThunk());
    }, [dispatch]);

    return(
        <div className="main">
            <div className="header">
                <nav className="header__nav">
                    <Link to="/" className="header__nav__logo">
                        <img src="/logo.jpg" alt="logo palais aux herbes" className="header__nav__logo--img"/>
                        <h1 className="header__nav__logo--title">PALAIS AUX HERBES</h1>
                    </Link>
                    <div className="header__nav__menu">
                        <Link to={(token) ? "/user" : "/login"} className="header__nav__menu--elt">
                            <i className="fa-solid fa-user"></i>
                        </Link>
                        <p className="header__nav__menu--elt" onClick={() => dispatch(showCart())}>
                            <i className="fas fa-shopping-bag"></i>
                        </p>
                    </div>
                </nav>
                <div className="header__filter"></div>
            </div>
            <Routes>
                <Route index path="/" element={<Shop/>}/>
                <Route path="/:category/:name" element={<Shop/>}/>
                <Route path="/product/:category/:name" element={<Product/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/order" element={<Order/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/login" element={<Auth/>}/>
                <Route path="/user" element={<User/>}/>
                <Route path="/CGU" element={<CGU/>}/>
                <Route path="/reset-password" element={<ResetPwd/>}/>
                <Route path="/success/order/:id" element={<SuccessOrder/>}/>
                <Route path="/verify-email" element={<EmailConfirm/>}/>
            </Routes>
            <Cart/>
            <footer className="footer">
                <img src="/logo_footer.jpg" alt="Logo footer" className="footer--logo"/>
                <div className="footer__nav">
                    <ul className="footer__nav__navbar">
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link>A propos</Link>
                        </li>
                        <li>
                            <Link to="/CGU">Condition general d'utilisation (CGU)</Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default App;