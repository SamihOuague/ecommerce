import React, { useEffect, useCallback } from "react";
import { 
    getInfosThunk, 
    setEditMode, 
    updateInfosThunk, 
    deleteInfosThunk, 
    confirmEmailThunk, 
    setPopOpen,
    getUserOrdersThunk,
    setPopDelOpen,
} from "./userSlice";
import { logout, pingThunk } from "../auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PopUpConfirm = () => {
    const dispatch = useDispatch();
    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">Confirm your Email<span onClick={() => dispatch(setPopOpen(false))}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <button onClick={() => dispatch(confirmEmailThunk())} className="button">Resend Confirmation</button>
                <button className="button" onClick={() => dispatch(setPopOpen(false))}>Cancel</button>
            </div>
        </div>
    );
}

const PopUpDelete = () => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        let u = await dispatch(deleteInfosThunk());
        if (u.payload._id) dispatch(logout());
    }

    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">Delete Account <span onClick={() => dispatch(setPopDelOpen(false))}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>This action is irreversible, are you sure to want continue ?</p>
                <button onClick={() => handleDelete()} className="button">Delete Account</button>
                <button className="button" onClick={() => dispatch(setPopDelOpen(false))}>Cancel</button>
            </div>
        </div>
    );
}

const User = () => {
    const dispatch = useDispatch();
    const { infos, edit, confirmToken, popOpen, orders, popDelOpen } = useSelector((state) => state.user);
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
        if (e.target.phoneNumber.value) data.phoneNumber = e.target.phoneNumber.value;
        dispatch(updateInfosThunk(data));
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
                                    <p><span><b>Phone</b></span> {infos.phoneNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="user__container__infos__btngroup">
                            <button className="button" onClick={() => dispatch(logout())}>Log out</button>
                            <button className="button" onClick={() => dispatch(setEditMode(true))}>Edit</button>
                        </div>
                        <button className="button" onClick={() => dispatch(setPopDelOpen(true))}>Delete profil</button>
                    </div>
                </div>
                <div className="user__container">
                    <div className="user__container__orders">
                        {orders.map((value, key) => (
                            <div className="user__container__orders__order" key={key}>
                                <h3 className="user__container__orders__order--title">{value.created_at.split("T")[0]}</h3>
                                {value.bill.map((v, k) => (
                                    <div key={k} className="user__container__orders__order__bill">
                                        <p className="user__container__orders__order__bill--elt">{v.title}</p>
                                        <p className="user__container__orders__order__bill--elt">{v.price}$ (x{v.qt})</p>
                                    </div>
                                ))}
                                <div className="user__container__orders__order__bill__total">

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {(popOpen) &&
                    <PopUpConfirm/>
                }
                {(popDelOpen && !popOpen) &&
                    <PopUpDelete/>
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
                                        <span><b>Phone</b></span> 
                                        <input type="tel" name="phoneNumber" placeholder="Your Phone Number" defaultValue={infos.phoneNumber} />
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