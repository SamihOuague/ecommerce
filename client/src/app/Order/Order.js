import React, { useState } from "react";
import { Resources, Spinner } from "../Resources/Resources";
import { Routes, Route, useParams, useSearchParams } from "react-router-dom";
import AutoComplete from "./components/AutoComplete";
import OrderContainer from "./components/OrderContainer";
import Success from "./components/Success";

const CheckoutResources = ({setInfos}) => {
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}/auth/get-user`} render={(data) => {
            if (data.loading) return <Spinner/>;
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
    return <Resources path={`${process.env.REACT_APP_API_URL}/order/config`} render={(data) => {
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
        order_id: id,
    };
    return <Resources path={`${process.env.REACT_APP_API_URL}/order/confirm-order/${id}`} render={(data) => {
        if (data.loading) return <Spinner />;
        return <Success orderStatus={d.status}/>
    }} options={{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(d),
    }}/>
}

function Order({ setToken }) {
    const [ infos, setInfos ] = useState();
    const logOut = () => {
        localStorage.removeItem("token");
        setToken(null);
    }
    return (
        <Routes>
            <Route path="/" element={<CheckoutResources logOut={logOut} setInfos={setInfos}/>}/>
            <Route path="/payment" element={<PaymentResources infos={infos}/>}/>
            <Route path="/success/:id" element={<ConfirmationResources/>}/>
        </Routes>
    );
}

export default Order;