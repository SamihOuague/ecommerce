import React from "react";
import { Link } from "react-router-dom";

function Success({ orderStatus, message }) {
    if (localStorage.getItem("cart") && !message) localStorage.removeItem("cart");
    return (
        <div className="success">
            <h1 className="success--title">Paiement {orderStatus}!</h1>
            <div className="success__container">
                {(message) && <p style={{color: "red"}}>{message}</p>}
                <Link to={"/"}>Retourner a la page d'accueil</Link>
            </div>
        </div>
    );
}

export default Success;