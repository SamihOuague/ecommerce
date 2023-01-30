import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Shop from "./app/Shop/Shop";
import Product from "./app/Product/Product";
import Cart from "./app/Cart/Cart";
import Contact from "./app/Contact/Contact";
import CGU from "./app/CGU/CGU";
import Auth from "./app/Auth/Auth";
import User from "./app/User/User";
import Order from "./app/Order/Order";
import * as smoothscroll from "smoothscroll-polyfill";
import './App.css';

smoothscroll.polyfill();
function App() {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
    const [show, setShow] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const removeFromCart = (id_prod) => {
        let c = [...cart.filter((v) => v._id !== id_prod)]
        setCart(c);
        localStorage.setItem("cart", JSON.stringify(c));
    }

    const addToCart = (prod, qt = 1) => {
        let c = [...cart]
        let p = c.find((v) => v._id === prod._id);
        if (!p) {
            c = [...c, { ...prod, qt }];
            localStorage.setItem("cart", JSON.stringify(c));
            setCart(c);
        }
        else if (p && p.qt >= 1) {
            p.qt = p.qt + qt;
            localStorage.setItem("cart", JSON.stringify(c));
            setCart(c);
            if (p.qt === 0) removeFromCart(prod._id);
        } else removeFromCart(prod._id);
        if (show !== "show") setShow("show");
    }

    return (
        <div className="main">
            <div className="header">
                <nav className="header__nav">
                    <Link to="/" className="header__nav__logo">
                        <img src="/logo.jpg" alt="logo palais aux herbes" className="header__nav__logo--img" />
                        <h1 className="header__nav__logo--title">PALAIS AUX HERBES</h1>
                    </Link>
                    <div className="header__nav__menu">
                        <Link to="/user" className="header__nav__menu--elt">
                            <i className="fa-solid fa-user"></i>
                        </Link>
                        <p className="header__nav__menu--elt" onClick={() => setShow("show")}>
                            <i className="fas fa-shopping-bag"></i>
                        </p>
                    </div>
                </nav>
                <div className="header__filter"></div>
            </div>
            <Routes>
                <Route index path="/" element={<Shop addToCart={addToCart} />} />
                <Route path="/category/:category/:name" element={<Shop addToCart={addToCart} />} />
                <Route path="/product/:category/:name" element={<Product addToCart={addToCart} />} />
                <Route path="/auth/*" element={<Auth token={token} setToken={setToken} />} />
                <Route path="/order/*" element={<Order token={token} setToken={setToken} />} />
                <Route path="/user" element={<User token={token} setToken={setToken} />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/CGU" element={<CGU />} />
            </Routes>
            <Cart cart={cart} show={show} setShow={setShow} addToCart={addToCart} />
            <footer className="footer">
                <img src="/logo_footer.jpg" alt="Logo footer" className="footer--logo" />
                <div className="footer__nav">
                    <ul className="footer__nav__navbar">
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link to="/">A propos</Link>
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