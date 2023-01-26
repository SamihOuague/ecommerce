import React, { useEffect, useCallback } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { getConfigThunk, paymentIntentThunk, postOrderThunk } from "./orderSlice";
import { pingThunk } from "../auth/authSlice";
import { setLocked } from "../cart/cartSlice";
import { getInfosThunk } from "../user/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate } from "react-router-dom";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { cart, loading, shippingInfos } = useSelector((state) => state.order);
    const { infos } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getInfosThunk());
    }, [dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const data = {...shippingInfos, email: infos.email};

        if (data.email && data.firstname && data.lastname && data.phoneNumber && data.address && data.zipcode && data.city && cart) {
            let { payload } = await dispatch(postOrderThunk({...data, bill: cart}));
            if (payload._id) {
                const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `https://localhost:3000/success/order/${payload._id}`,
                    },
                });
                if (result.error) {
                    console.log(result.error.message);
                }
                localStorage.removeItem("cart");
            }
        }
    }


    return (
        <form className="order__container__form" onSubmit={handleSubmit}>
            <PaymentElement />
            <button className="button" disabled={loading}>{(loading) ? "Loading..." : "Proceder au Paiement"}</button>
        </form>
    );
}

const Order = () => {
    const dispatch = useDispatch();
    const { publishableKey, clientSecret, cart, amount, shippingInfos } = useSelector((state) => state.order);
    const c = useSelector((state) => state.cart.cart);
    const token = useSelector((state) => state.auth.token);
    const { infos } = useSelector((state) => state.user);
    const confirmed = (!infos) ? false : infos.confirmed;
    let stripePromise;
    const intentToPay = useCallback((c) => {
        if (token && shippingInfos) dispatch(paymentIntentThunk({cart: c}));
    }, [dispatch, token, shippingInfos]);

    useEffect(() => {
        dispatch(getConfigThunk());
        dispatch(getInfosThunk());
        dispatch(pingThunk());
        dispatch(setLocked(true));
    }, [dispatch]);

    useEffect(() => {
        intentToPay(c);
    }, [intentToPay, c]);

    if (!token) return <Navigate to={"/login"}/>
    else if (!shippingInfos) return <Navigate to={"/checkout"}/>
    else if (!infos) return (
        <div className="order">
            <div className="spinner-container">
                <i className="fa-solid fa-spinner"></i>
            </div>
        </div>
    );
    else if (token && !confirmed) return <Navigate to={"/user"}/>
    else if (publishableKey) stripePromise = loadStripe(publishableKey);
    return (
        <div className="order">
            {(!amount) ? 
                <div className="spinner-container">
                    <i className="fa-solid fa-spinner"></i>
                </div> :
                <div>
                    <h2 className="order--title">Proceder au Paiement</h2>
                    <div className="order__bill">
                        <div className="order__bill__container">
                            {cart.map((v, k) => (
                                <div key={k} className="order__bill__container__product">
                                    <p><i>{v.title} - x{v.qt}</i></p>
                                    <p><i>{v.price}$</i></p>
                                </div>
                            ))}
                            <div className="order__bill__container__total">
                                <p><b>Total</b></p>
                                <p><b>{`${String(amount).substring(0, String(amount).length - 2)},${String(amount).substring(String(amount).length - 2)}$`}</b></p>
                            </div>
                        </div>
                    </div>
                    <div className="order__container">
                        {stripePromise && clientSecret &&
                            <Elements stripe={stripePromise} options={{clientSecret}}>
                                <CheckoutForm/>
                            </Elements>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Order;