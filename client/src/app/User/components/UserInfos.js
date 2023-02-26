import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { PKCEComponent, SubmitComponent } from "../../PKCE/PKCEComponents";
import { Resources, Spinner } from "../../Resources/Resources";

function UserInfos({ infos }) {
    const [showDelete, setShowDelete] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const logOut = () => {
        localStorage.removeItem("token");
        setRedirect(true);
    };

    if (!infos || !infos._id || redirect) return (<Navigate to={"/auth"} />);
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
                                <p className="user__container__infos__elt__box--info-email">
                                    <span><b>Email</b></span>
                                    <span style={{ color: (infos.confirmed) ? 'black' : 'red' }}>
                                        {infos.email} {(!infos.confirmed) && <i className="fa-solid fa-circle-exclamation"></i>}
                                    </span>
                                </p>
                                {(!infos.confirmed) && <button onClick={() => setShowConfirm(true)} className="button">Confirmer mon email</button>}
                            </div>
                            <div className="user__container__infos__elt__box--info">
                                <p><span><b>Tel.</b></span> {infos.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                    <div className="user__container__infos__btngroup">
                        <button className="button" onClick={() => logOut()}>Se Deconnecter</button>
                        <Link className="button" to="/user?edit_mode=on">Editer</Link>
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
                            return <Navigate to="/auth" />;
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
                    }} />
                </div>
            </div>
            {(showConfirm) &&
                <PopUpConfirm setShowConfirm={setShowConfirm} />
            }
            {(showDelete) &&
                <PopUpDelete setShowDelete={setShowDelete} logOut={logOut} />
            }
        </div>
    );
}

const PopUpConfirm = ({ setShowConfirm }) => {
    const [ getConfirm, setGetConfirm ] = useState(false);

    return (
        <div className="popup">
            <div className="popup__container">
                <h2 className="popup__container--title">
                    Confirmer votre email
                    <span onClick={() => setShowConfirm(false)}>
                        <i className="fa-regular fa-circle-xmark"></i>
                    </span>
                </h2>
                {(getConfirm) &&
                    <Resources path={`${process.env.REACT_APP_API_URL}/auth/confirm-email`} options={{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Barear ${localStorage.getItem("token")}`,
                        }
                    }} render={(data) => {
                        if (data.loading) return <Spinner />
                        else if (!data.payload || !data.payload.message) return <p>Bad Request</p>;
                        return <p>{(data.payload && data.payload.message) && data.payload.message}</p>;
                    }} />
                }
                {(!getConfirm) &&
                    <div className="btn-group">
                        <button className="button" onClick={() => setGetConfirm(true)}>Confirmer mon mail</button>
                        <button className="button btn-danger" onClick={() => setShowConfirm(false)}>Annuler</button>
                    </div>
                }
            </div>
        </div>
    );
}

const PopUpDelete = ({ setShowDelete }) => {
    const [dataForm, setDataForm] = useState();
    const handleDeleteProfil = (e) => {
        e.preventDefault();
        const { nonce, token } = e.target
        setDataForm({
            nonce: nonce.value,
            token: token.value,
        });
    }
    return (
        <div className="popup">
            <form className="popup__container" onSubmit={(e) => handleDeleteProfil(e)}>
                <h2 className="popup__container--title">Supprimer votre compte <span onClick={() => setShowDelete(false)}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>Cette action est irreversible, voulez vous continuer ?</p>
                <PKCEComponent />
                <SubmitComponent
                    btnValue={"Supprimer le compte"}
                    path={`${process.env.REACT_APP_API_URL}/auth/delete-user`}
                    method="DELETE"
                    dataForm={dataForm}
                />
                <button className="button btn-danger" onClick={() => setShowDelete(false)}>Annuler</button>
            </form>
        </div>
    );
}

export default UserInfos;