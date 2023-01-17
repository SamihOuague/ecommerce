import React, { useEffect, useCallback } from "react";
import { 
    getInfosThunk, 
    setEditMode, 
    updateInfosThunk, 
    deleteInfosThunk, 
    confirmEmailThunk, 
    setPopOpen,
    getUserOrdersThunk
} from "./userSlice";
import { logout, pingThunk } from "../auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PopUp = () => {
    const dispatch = useDispatch();
    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">Confirm your Email</h2>
                <button onClick={() => dispatch(confirmEmailThunk())} className="button">Resend Confirmation</button>
            </div>
        </div>
    );
}

const User = () => {
    const dispatch = useDispatch();
    const { infos, edit, confirmToken, popOpen, orders } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getInfosThunk());
        dispatch(pingThunk());
        dispatch(getUserOrdersThunk());
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

    const openPopUp = useCallback(() => {
        if (infos && !infos.confirmed) dispatch(setPopOpen(true));
        else dispatch(setPopOpen(false));
    }, [dispatch, infos]);

    useEffect(() => {
        openPopUp()
    }, [openPopUp]);
    if (!token) return (<Navigate to={"/login"} />);
    if (!infos) {
        return (
            <div className="user">
                <div className="spinner-container">
                    <i className="fa-solid fa-spinner"></i>
                </div>
            </div>
        );
    }
    if (!edit) {
        return (
            <div className="user">
                <div className="user__container">
                    <div className="user__container__infos">
                        <div className="user__container__infos__elt">
                            <h1 className="user--title">Dashboard</h1>
                            <h2>Informations</h2>
                            {(confirmToken) && <p style={{maxWidth: "200px", overflowWrap: "break-word"}}>{confirmToken}</p>}
                            <div className="user__container__infos__elt__box">
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Firstname</b></span> {infos.firstname}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Lastname</b></span> {infos.lastname}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Email</b></span> {infos.email}</p>
                                    {(!infos.confirmed && !confirmToken) && <button onClick={() => dispatch(confirmEmailThunk())} className="button">Confirm</button>}
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>City</b></span> {infos.city}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Zipcode</b></span> {infos.zipcode}</p>
                                </div>
                            </div>
                        </div>
                        <div className="user__container__infos__btngroup">
                            <button className="button" onClick={() => dispatch(logout())}>Log out</button>
                            <button className="button" onClick={() => dispatch(setEditMode(true))}>Edit</button>
                        </div>
                        <button className="button" onClick={() => handleDelete()}>Delete profil</button>
                    </div>
                </div>
                <div className="user__container">
                    <div className="user__container__orders">
                        {orders.map((value, key) => (
                            <div className="user__container__orders__order" key={key}>
                                <h3>{value.created_at.split("T")[0]}</h3>
                                {value.bill.map((v, k) => (
                                    <div key={key} className="user__container__orders__order__bill">
                                        <h3>{v.title} - {v.price} x{v.qt}</h3>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {(popOpen) &&
                    <PopUp/>
                }
            </div>
        );
    } else {
        return (
            <div className="user">
                <div className="user__container">
                    <form onSubmit={(e) => handleSubmit(e)} className="user__container__infos">
                        <div className="user__container__infos__elt">
                            <h1 className="user--title">Dashboard</h1>
                            <h2>Edit informations</h2>
                            <div className="user__container__infos__elt__box">
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>Firstname</b></span> 
                                        <input type="text" name="firstname" placeholder="Your firstname" defaultValue={infos.firstname} />
                                    </div>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>Lastname</b></span> 
                                        <input type="text" name="lastname" placeholder="Your lastname" defaultValue={infos.lastname} />
                                    </div>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>Email</b></span> 
                                        <input type="text" name="email" placeholder="Your email" defaultValue={infos.email} />
                                    </div>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>City</b></span> 
                                        <input type="text" name="city" placeholder="Your City" defaultValue={infos.city} />
                                    </div>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>Zipcode</b></span> 
                                        <input type="text" name="zipcode" placeholder="Your zipcode" defaultValue={infos.zipcode} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user__container__infos__btngroup">
                            <button className="button" type="submit">Edit</button>
                            <button className="button" onClick={() => dispatch(setEditMode(false))}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default User;