import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Resources, Spinner } from "../../Resources/Resources";

const CheckoutForm = ({ infos }) => {
    const [ loading, setLoading ] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/order/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({...infos, bill: JSON.parse(localStorage.getItem("cart"))}),
        }).then(async (res) => {
            let r = await res.json();
            if (r && r._id) {
                const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${process.env.REACT_APP_LOCAL_URL}/order/success/${r._id}`,
                    }
                });
                if (result.error) console.log(result.error.message);
                localStorage.removeItem("cart");
            }
        });
    }
    if (!infos) return <Navigate to="/order"/>;
    return (
        <form className="order__container__form" onSubmit={(e) => handleSubmit(e)}>
            <PaymentElement />
            <button className={`${(loading) ?  'btn-disabled' : 'button'}`} disabled={loading}>{(loading) ? "Loading..." : "Proceder au Paiement"}</button>
        </form>
    );
}

const StripeResources = ({ infos, pubKey }) => {
    let stripePromise;
    if (pubKey) stripePromise = loadStripe(pubKey);
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}/order/create-payment-intent`} render={(data) => {
            if (data.loading) return <Spinner />
            else if (!data.payload || !data.payload.amount) return <Navigate to="/" />
            const { amount, cart, clientSecret } = data.payload;
            return (
                <div>
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
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm infos={infos}/>
                            </Elements>
                        }
                    </div>
                </div>
            );
        }} options={{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ cart: JSON.parse(localStorage.getItem("cart")) }),
        }} />
    );
};

function OrderContainer({ infos, pubKey }) {
    //const stripe = useStripe();
    //const elements = useElements();
    if (!pubKey || !pubKey.publishableKey) return <Navigate to="/user" />;
    return (
        <div className="order">
            <h2 className="order--title">Proceder au Paiement</h2>
            <StripeResources infos={infos} pubKey={pubKey.publishableKey} />
        </div>
    );
}

export default OrderContainer;