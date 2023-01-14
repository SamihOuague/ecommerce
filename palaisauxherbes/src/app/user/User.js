import React, { useEffect } from "react";
import { getInfosThunk } from "./userSlice";
import { logout, pingThunk } from "../auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const User = () => {
    const dispatch = useDispatch();
    const { infos } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);
    
    useEffect(() => {
        dispatch(getInfosThunk());
        dispatch(pingThunk());
    }, [dispatch]);

    if (!token) return <Navigate to={"/login"}/>
    if (!infos) return <p>Loading...</p>
    return (
        <div className="user">
            <h1 className="user--title">Dashboard</h1>
            <h2>Informations</h2>
            <p>Firstname : {infos.firstname}</p>
            <p>Lastname : {infos.lastname}</p>
            <p>Email : {infos.email}</p>
            <p>City : {infos.city}</p>
            <p>Zipcode : {infos.zipcode}</p>
            <button className="button" onClick={() => dispatch(logout())}>Log out</button>
        </div>
    );
}

export default User;