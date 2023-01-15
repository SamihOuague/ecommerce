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
            <h3>Contact information</h3>
            <div className="order__container__form__contact">
                <input type="email" placeholder="Enter your email" name="email" required/>
                <input type="tel" placeholder="Enter your phone number" name="tel" required/>
            </div>
            <h3>Shipping information</h3>
            <div className="order__container__form__shipping">
                <div className="order__container__form__shipping__fullname">
                    <input type="text" placeholder="Firstname" name="firstname" required/>
                    <input type="text" placeholder="Lastname" name="lastname" required/>
                </div>
                <div className="order__container__form__shipping__address">
                    <input type="text" placeholder="Address" name="address" required/>
                    <input type="text" placeholder="Appartment, suit .. (Optional)" name="option" required/>
                </div>
                <div className="order__container__form__shipping__city">
                    <input type="text" placeholder="Postal Code" name="postal" required/>
                    <input type="text" placeholder="City" name="city" required/>
                </div>
            </div>
            <PaymentElement />
            <button className="button">Pay Now</button>
        </form>
    );
}

const Order = () => {
    const dispatch = useDispatch();
    const { publishableKey, clientSecret, cart, amount } = useSelector((state) => state.order);
    const c = useSelector((state) => state.cart.cart);
    let stripePromise;

    useEffect(() => {
        dispatch(getConfigThunk());
    }, [dispatch]);

    useEffect(() => {
        dispatch(paymentIntentThunk({cart: c}));
    }, [dispatch, c]);

    if (publishableKey) stripePromise = loadStripe(publishableKey);
    return (
        <div className="order">
            <h2 className="order--title">Proceed to order</h2>
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
    );
}

export default Order;