import React, { useEffect, useCallback } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmOrderThunk } from "./orderSlice";

const SuccessOrder = () => {
    const [ URLSearchParams ] = useSearchParams();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { orderStatus, loading } = useSelector((state) => state.order);

    const handleConfirmation = useCallback(() => {
        const data = {
            paymentIntent: URLSearchParams.get("payment_intent"),
            paymentClientSecret: URLSearchParams.get("payment_intent_client_secret"),
            status: URLSearchParams.get("redirect_status"),
            order_id: id,
        };
        const { paymentIntent, paymentClientSecret, status, order_id } = data;
        if (!paymentIntent || !paymentClientSecret || !order_id || status !== "succeeded") return;
        else {
            dispatch(confirmOrderThunk(data));
        }
    }, [dispatch, URLSearchParams, id]);

    useEffect(() => {
        handleConfirmation();
    }, [handleConfirmation]);

    if (loading) return (
        <div className="success">
            <div className="spinner-container">
                <i className="fa-solid fa-spinner"></i>
            </div>
        </div>
    )
    return (
        <div className="success">
            <h1 className="success--title">Paiement {(!orderStatus) ? "Echouer " : "Reussi "} !</h1>
            <div className="success__container">
                <Link to={"/"}>Retourner a la page d'accueil</Link>
            </div>
        </div>
    );
}

export default SuccessOrder;