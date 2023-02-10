import React from "react";
import UserInfos from "./components/UserInfos";
import EditUser from "./components/EditUser"
import { Resources, Spinner } from "../Resources/Resources";
import { Navigate, useSearchParams } from "react-router-dom";

function User() {
    const token = localStorage.getItem("token");
    const [ URLSearchParams ] = useSearchParams();
    if (!token) return <Navigate to="/auth"/>
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}:3001/get-user`} render={(data) => {
            if (data.loading) return <Spinner/>;
            else if (!data.payload || data.payload.success === false) {
                localStorage.removeItem("token");
                return <Navigate to="/auth"/>
            }
            if (URLSearchParams.get("edit_mode")) return <EditUser infosUser={data.payload}  />
            return <UserInfos infos={data.payload} />
        }} options={{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${token}`
            }
        }}/>
    );
}

export default User;