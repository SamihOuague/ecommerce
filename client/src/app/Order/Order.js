import React, { useState } from "react";
import { Resources, Spinner } from "../Resources/Resources";
import { Routes, Route, useParams, useSearchParams, Navigate } from "react-router-dom";
import AutoComplete from "./components/AutoComplete";
import OrderContainer from "./components/OrderContainer";
import Success from "./components/Success";

const CheckoutResources = ({setInfos}) => {
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}:3001/get-user`} render={(data) => {
            if (data.loading) return <Spinner/>;
            else if (!data.payload || data.payload.success === false) return <Navigate to="/auth?redirect_url=/order" />;
            return <AutoComplete infos={data.payload} setInfos={setInfos}/>
        }} options={{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`
            }
        }}/>
    );
}

const PaymentResources = ({ infos }) => {
    return <Resources path={`${process.env.REACT_APP_API_URL}:3004/config`} render={(data) => {
        if (data.loading) return <Spinner />;
        return <OrderContainer infos={infos} pubKey={data.payload}/>;
    }} options={{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`,
        }
    }}/>
}

const ConfirmationResources = () => {
    const [ URLSearchParams ] = useSearchParams();
    const { id } = useParams();
    const d = {
        paymentIntent: URLSearchParams.get("payment_intent"),
        paymentClientSecret: URLSearchParams.get("payment_intent_client_secret"),
        status: URLSearchParams.get("redirect_status"),
        message: URLSearchParams.get("message"),
        order_id: id,
    };
    return <Resources path={`${process.env.REACT_APP_API_URL}:3004/confirm-order/${id}`} render={(data) => {
        if (data.loading) return <Spinner />;
        return <Success orderStatus={d.status} message={d.message}/>
    }} options={{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(d),
    }}/>
}

function Order() {
    const [ infos, setInfos ] = useState();
    return (
        <Routes>
            <Route path="/" element={<CheckoutResources setInfos={setInfos}/>}/>
            <Route path="/payment" element={<PaymentResources infos={infos}/>}/>
            <Route path="/success/:id" element={<ConfirmationResources/>}/>
        </Routes>
    );
}

export default Order;