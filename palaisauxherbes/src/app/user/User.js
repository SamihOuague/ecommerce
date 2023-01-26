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
    const { loading } = useSelector((state) => state.user);
    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">Confirmer votre email<span onClick={() => dispatch(setPopOpen(false))}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <button onClick={() => dispatch(confirmEmailThunk())} className="button" disabled={loading}>{(loading) ? "Chargement..." : "Revoyer le mail"}</button>
                <button className="button btn-danger" onClick={() => dispatch(setPopOpen(false))}>Annuler</button>
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
                <h2 className="popup__container--title">Supprimer votre compte <span onClick={() => dispatch(setPopDelOpen(false))}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>Cette action est irreversible, voulez vous continuer ?</p>
                <button onClick={() => handleDelete()} className="button">Supprimer le compte</button>
                <button className="button btn-danger" onClick={() => dispatch(setPopDelOpen(false))}>Annuler</button>
            </div>
        </div>
    );
}

const User = () => {
    const dispatch = useDispatch();
    const { infos, edit, confirmToken, popOpen, orders, popDelOpen, loading } = useSelector((state) => state.user);
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
                            <h1 className="user--title">Tableau de bord</h1>
                            <h2>Informations</h2>
                            {(confirmToken) && <p style={{maxWidth: "200px", overflowWrap: "break-word"}}>{confirmToken}</p>}
                            <div className="user__container__infos__elt__box">
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Prenom</b></span> {infos.firstname}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Nom</b></span> {infos.lastname}</p>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Email</b></span> {infos.email}</p>
                                    {(!infos.confirmed && !confirmToken) && <button onClick={() => dispatch(confirmEmailThunk())} className="button" disabled={loading}>{(loading) ? "Chargement..." : "Confirmer"}</button>}
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <p><span><b>Tel.</b></span> {infos.phoneNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="user__container__infos__btngroup">
                            <button className="button" onClick={() => dispatch(logout())}>Se Deconnecter</button>
                            <button className="button" onClick={() => dispatch(setEditMode(true))}>Editer</button>
                        </div>
                        <button className="button btn-danger" onClick={() => dispatch(setPopDelOpen(true))}>Supprimer</button>
                    </div>
                </div>
                <div className="user__container">
                    <div className="user__container__orders">
                        <h2>Vos Commandes</h2>
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
                            <h1 className="user--title">Tableau de bord</h1>
                            <h2>Editer vos informations</h2>
                            <div className="user__container__infos__elt__box">
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>Prenom</b></span> 
                                        <input type="text" name="firstname" placeholder="Your firstname" defaultValue={infos.firstname} />
                                    </div>
                                </div>
                                <div className="user__container__infos__elt__box--info">
                                    <div>
                                        <span><b>Nom</b></span> 
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
                                        <span><b>Tel.</b></span> 
                                        <input type="tel" name="phoneNumber" placeholder="Your Phone Number" defaultValue={infos.phoneNumber} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user__container__infos__btngroup">
                            <button className="button" type="submit">Editer</button>
                            <button className="button btn-danger" onClick={() => dispatch(setEditMode(false))}>Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default User;