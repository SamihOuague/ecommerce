import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Resources, Spinner } from "../../Resources/Resources";

function UserInfos({ infos, setEdit, logOut }) {
    // eslint-disable-next-line
    const [loading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    if (!infos || !infos._id) return (<Navigate to={"/auth"} />);
    return (
        <div className="user">
            <div className="user__container">
                <div className="user__container__infos">
                    <div className="user__container__infos__elt">
                        <h1 className="user--title">Tableau de bord</h1>
                        <h2>Informations</h2>
                        <div className="user__container__infos__elt__box">
                            <div className="user__container__infos__elt__box--info">
                                <p><span><b>Prenom</b></span> {infos.firstname}</p>
                            </div>
                            <div className="user__container__infos__elt__box--info">
                                <p><span><b>Nom</b></span> {infos.lastname}</p>
                            </div>
                            <div className="user__container__infos__elt__box--info">
                                <p><span><b>Email</b></span> {infos.email}</p>
                                {(!infos.confirmed) && <button onClick={() => console.log("")} className="button">{(loading) ? "Chargement..." : "Confirmer"}</button>}
                            </div>
                            <div className="user__container__infos__elt__box--info">
                                <p><span><b>Tel.</b></span> {infos.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                    <div className="user__container__infos__btngroup">
                        <button className="button" onClick={() => logOut()}>Se Deconnecter</button>
                        <button className="button" onClick={() => setEdit(true)}>Editer</button>
                    </div>
                    <button className="button btn-danger" onClick={() => setShowDelete(true)}>Supprimer</button>
                </div>
            </div>
            <div className="user__container">
                <div className="user__container__orders">
                    <h2>Vos Commandes</h2>
                    <Resources path={`${process.env.REACT_APP_API_URL}/order/user-orders`} render={(data) => {
                        if (data.loading) return <Spinner />
                        else if (data.payload.logged === false || !data.payload) {
                            logOut();
                            return <Navigate to="/auth"/>;
                        }
                        return (
                            <div>
                                {data.payload.map((value, key) => (
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
                        );
                    }} options={{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Barear ${localStorage.getItem("token")}`,
                        }
                    }}/>
                </div>
            </div>
            {(false) &&
                <PopUpConfirm />
            }
            {(showDelete) &&
                <PopUpDelete setShowDelete={setShowDelete} logOut={logOut}/>
            }
        </div>
    );
}

const PopUpConfirm = () => {
    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">
                    Confirmer votre email
                    <span onClick={() => console.log("")}>
                        <i className="fa-regular fa-circle-xmark"></i>
                    </span>
                </h2>
                <button className="button" onClick={() => console.log("")}>Revoyer le mail</button>
                <button className="button btn-danger" onClick={() => console.log("")}>Annuler</button>
            </div>
        </div>
    );
}

const PopUpDelete = ({ setShowDelete, logOut }) => {
    const handleDeleteProfil = () => {
        fetch(`${process.env.REACT_APP_API_URL}/auth/delete-user`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`
            }
        }).then(async (res) => {
            let r = await res.json();
            if (r._id) logOut();
        }).catch((e) => {
            console.log(e);
        });
    }
    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">Supprimer votre compte <span onClick={() => setShowDelete(false)}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>Cette action est irreversible, voulez vous continuer ?</p>
                <button onClick={() => handleDeleteProfil()} className="button">Supprimer le compte</button>
                <button className="button btn-danger" onClick={() => setShowDelete(false)}>Annuler</button>
            </div>
        </div>
    );
}

export default UserInfos;