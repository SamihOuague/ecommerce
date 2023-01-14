import React, { useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { getConfigThunk, paymentIntentThunk, postOrderThunk } from "./orderSlice";
import { loadStripe } from "@stripe/stripe-js";


const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const data = {
            email: event.target.email.value, 
            firstname: event.target.firstname.value, 
            lastname: event.target.lastname.value,
            phoneNumber: event.target.tel.value,
            address: event.target.address.value,
            zipcode: event.target.postal.value,
            city: event.target.city.value,
        }
        if (data.email && data.firstname && data.lastname && data.phoneNumber && data.address && data.zipcode && data.city) {
            let { payload } = await dispatch(postOrderThunk(data));
            if (payload._id) {
                const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `http://localhost:3000/order/${payload._id}`,
                    }
                });
            
                if (result.error) {
                    console.log(result.error.message);
                }
            }
        }
    }

    return (
        <form className="order__container__form" onSubmit={handleSubmit}>
            <div className="order__container__form__contact">
                <h3>Contact information</h3>
                <input type="email" placeholder="Enter your email" name="email"/>
                <input type="tel" placeholder="Enter your phone number" name="tel"/>
            </div>
            <div className="order__container__form__shipping">
                <h3>Shipping information</h3>
                <select name="country">
                    <option>Country</option>
                    <option>France</option>
                    <option>Belgique</option>
                    <option>Suisse</option>
                </select>
                <div className="order__container__form__shipping__fullname">
                    <input type="text" placeholder="Firstname" name="firstname"/>
                    <input type="text" placeholder="Lastname" name="lastname"/>
                </div>
                <input type="text" placeholder="Address" name="address"/>
                <input type="text" placeholder="Appartment, suit .. (Optional)" name="option"/>
                <div className="order__container__form__shipping__city">
                    <input type="text" placeholder="Postal Code" name="postal"/>
                    <input type="text" placeholder="City" name="city"/>
                </div>
            </div>
            <PaymentElement />
            <button className="button">Pay Now</button>
        </form>
    );
}

const Order = () => {
    const dispatch = useDispatch();
    const { publishableKey, clientSecret } = useSelector((state) => state.order);
    const { cart } = useSelector((state) => state.cart);
    let stripePromise;
    useEffect(() => {
        dispatch(getConfigThunk());
    }, [dispatch]);

    useEffect(() => {
        dispatch(paymentIntentThunk({cart}));
    }, [dispatch, cart]);

    if (publishableKey) stripePromise = loadStripe(publishableKey);
    return (
        <div className="order">
            <h2 className="order--title">Proceed to order</h2>
            <div className="order__container">
                {stripePromise && clientSecret &&
                    <Elements stripe={stripePromise} options={{clientSecret}}>
                        <CheckoutForm/>
                    </Elements>
                }
            </div>
        </div>
    );
}

export default Order;