import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function EditUser({ infosUser, setEdit, logOut }) {
    //eslint-disable-next-line
    const [ infos, setInfos ] = useState(infosUser);

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
            phoneNumber: e.target.phoneNumber.value,
            email: e.target.email.value,
        };
        let nd = []
        for (let i = 0, k = Object.keys(data), d = null; i < k.length; i++) {
            d = data[k[i]]
            if (d) nd.push(d);
        }
        fetch(`${process.env.REACT_APP_API_URL}/auth/update-user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data),
        }).then(async (res) => {
            let r = await res.json();
            if (r && r._id) setInfos(r);
            else if (r.logged === false) logOut();
            setEdit(false);
        }).catch((e) => {
            console.log(e);
            logOut();
        });
    }

    if (!infos || !infos._id) return <Navigate to="/"/>
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
                        <button className="button btn-danger" onClick={() => setEdit(false)}>Annuler</button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default EditUser;