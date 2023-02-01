import React from "react";
import ProductComponent from "./components/ProductComponent";
import OrdersComponent from "./components/OrdersComponent";
import { Resources, Spinner } from "../Resources/Resources";
import { Navigate } from "react-router-dom";

const ProductResources = () => {
    return <Resources path={`${process.env.REACT_APP_API_URL}/product/`} render={(data) => {
        if (data.loading) return <Spinner />;
        else if (data.payload && data.payload.prods) return <ProductComponent productList={data.payload.prods} categoryList={data.payload.cat}/>;
        return <ProductComponent productList={[]} categoryList={[]}/>
    }}/>
}

const OrdersResources = () => {
    return <Resources path={`${process.env.REACT_APP_API_URL}/order/`} render={(data) => {
        if (data.loading) return <Spinner />
        else if (data.payload && data.payload.is_admin === false) return <Navigate to="/user"/>;
        return <OrdersComponent ordersList={data.payload}/>
    }} options={{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Barear ${localStorage.getItem("token")}`
        }
    }}/>
}

function Admin() {
    return (
        <div className="admin">
            <ProductResources/>
            <OrdersResources/>
        </div>
    );
}

export default Admin;