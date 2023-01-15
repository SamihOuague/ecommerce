import React, { useEffect } from "react";
//eslint-disable-next-line
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

    if (!token) return <Navigate to={"/login"} />
    if (!infos) return <p>Loading...</p>
    if (!edit) {
        return (
            <div className="user">
                <div className="user__container">
                    <div className="user__container__infos">
                        <div className="user__container__infos__elt">
                            <h1 className="user--title">Dashboard</h1>
                            <h2>Informations</h2>
                            <div className="user__container__infos__elt__box">
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Firstname</b></span> {infos.firstname}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Lastname</b></span> {infos.lastname}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Email</b></span> {infos.email}</p>
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
        )
    }
}
//<form className="user__form" onSubmit={(e) => handleSubmit(e)}>
//    <input type="text" name="firstname" placeholder="Your firstname" defaultValue={infos.firstname} />
//    <input type="text" name="lastname" placeholder="Your lastname" defaultValue={infos.lastname} />
//    <input type="email" name="email" placeholder="Your email" defaultValue={infos.email} />
//    <input type="text" name="city" placeholder="Your city" defaultValue={infos.city} />
//    <input type="text" name="zipcode" placeholder="Your zipcode" defaultValue={infos.zipcode} />
//    <button className="button" type="submit">Edit</button>
//    <button className="button" onClick={() => dispatch(setEditMode(false))}>Cancel</button>
//</form>

export default User;