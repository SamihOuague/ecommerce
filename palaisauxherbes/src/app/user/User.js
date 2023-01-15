import React, { useEffect } from "react";
import { getInfosThunk, setEditMode, updateInfosThunk, deleteInfosThunk } from "./userSlice";
import { logout, pingThunk } from "../auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const User = () => {
    const dispatch = useDispatch();
    const { infos, edit } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);
    
    useEffect(() => {
        dispatch(getInfosThunk());
        dispatch(pingThunk());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {}
        if (e.target.firstname.value) data.firstname = e.target.firstname.value;
        if (e.target.lastname.value) data.lastname = e.target.lastname.value;
        if (e.target.email.value) data.email = e.target.email.value;
        if (e.target.city.value) data.city = e.target.city.value;
        if (e.target.zipcode.value) data.zipcode = e.target.zipcode.value;
        dispatch(updateInfosThunk(data));
    }

    const handleDelete = async () => {
        let u = await dispatch(deleteInfosThunk());
        if (u.payload._id) dispatch(logout());
    }

    if (!token) return <Navigate to={"/login"}/>
    if (!infos) return <p>Loading...</p>
    if (!edit) {
        return (
            <div className="user">
                <h1 className="user--title">Dashboard</h1>
                <h2>Informations</h2>
                <p>Firstname : {infos.firstname}</p>
                <p>Lastname : {infos.lastname}</p>
                <p>Email : {infos.email}</p>
                <p>City : {infos.city}</p>
                <p>Zipcode : {infos.zipcode}</p>
                <div>
                    <button className="button" onClick={() => dispatch(logout())}>Log out</button>
                    <button className="button" onClick={() => dispatch(setEditMode(true))}>Edit</button>
                </div>
                <button className="button" onClick={() => handleDelete()}>Delete profil</button>
            </div>
        );
    } else {
        return (
            <div className="user">
                <h1 className="user--title">Dashboard</h1>
                <h2>Edit Informations</h2>
                <form className="user__form" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" name="firstname" placeholder="Your firstname" defaultValue={infos.firstname}/>
                    <input type="text" name="lastname" placeholder="Your lastname" defaultValue={infos.lastname}/>
                    <input type="email" name="email" placeholder="Your email" defaultValue={infos.email}/>
                    <input type="text" name="city" placeholder="Your city" defaultValue={infos.city}/>
                    <input type="text" name="zipcode" placeholder="Your zipcode" defaultValue={infos.zipcode}/>
                    <button className="button" type="submit">Edit</button>
                    <button className="button" onClick={() => dispatch(setEditMode(false))}>Cancel</button>
                </form>
            </div>
        )
    }
}

export default User;