import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Resources, Spinner } from "../../Resources/Resources";

const CheckoutForm = ({ infos }) => {
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState("");
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_ORDER}/`, {
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
                        return_url: `https://ec2-15-188-136-188.eu-west-3.compute.amazonaws.com/order/success/${r._id}`,
                    }
                });
                if (result.error) { 
                    setMessage(result.error.message);
                    setLoading(false);
                    navigate(`/order/success/${r._id}?payment_intent=${result.error.payment_intent.id}&payment_intent_client_secret=${result.error.payment_intent.client_secret}&message=${result.error.message}&redirect_status=Failed`)

                } else {
                    setMessage("Payment succeeded.");
                    localStorage.removeItem("cart");
                }
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    if (!infos) return <Navigate to="/order"/>;
    return (
        <form className="order__container__form" onSubmit={(e) => (!loading) && handleSubmit(e)}>
            <PaymentElement />
            {(message) && <p style={{"color": "red"}}>{message}</p>}
            <button className={`${(loading) ?  'btn-disabled' : 'button'}`} disabled={loading}>{(loading) ? "Loading..." : "Proceder au Paiement"}</button>
        </form>
    );
}

const StripeResources = ({ infos, pubKey }) => {
    let stripePromise;
    if (pubKey) stripePromise = loadStripe(pubKey);
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_ORDER}/create-payment-intent`} render={(data) => {
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
    if (!pubKey || !pubKey.publishableKey) return <Navigate to="/user" />;
    return (
        <div className="order">
            <h2 className="order--title">Proceder au Paiement</h2>
            <StripeResources infos={infos} pubKey={pubKey.publishableKey} />
        </div>
    );
}

export default OrderContainer;