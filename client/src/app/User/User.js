import React, { useState } from "react";
import UserInfos from "./components/UserInfos";
import EditUser from "./components/EditUser"
import { Resources, Spinner } from "../Resources/Resources";

function User({ token, setToken }) {
    const [ editMode, setEdit ] = useState(false);
    const logOut = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <Resources path={`${process.env.REACT_APP_API_URL}/auth/get-user`} render={(data) => {
            if (data.loading) return <Spinner/>;
            else if (!data.payload || data.payload.logged === false) logOut();
            if (editMode) return <EditUser infosUser={data.payload} setEdit={setEdit} logOut={logOut}/>
            return <UserInfos infos={data.payload} logOut={logOut} setEdit={setEdit}/>
        }} options={{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `barear ${token}`
            }
        }}/>
    );
}

export default User;