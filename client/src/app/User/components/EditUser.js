import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { PKCEComponent, SubmitComponent } from "../../PKCE/PKCEComponents";

function EditUser({ infosUser, setEdit }) {
    //eslint-disable-next-line
    const [infos] = useState(infosUser);
    const [dataForm, setDataForm] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { firstname, lastname, phoneNumber, email, token, nonce } = e.target;
        let data = {
            firstname: firstname.value,
            lastname: lastname.value,
            phoneNumber: phoneNumber.value,
            email: email.value,
        };
        let nd = []
        for (let i = 0, k = Object.keys(data), d = null; i < k.length; i++) {
            d = data[k[i]]
            if (d) nd.push(d);
        }
        setDataForm({ ...data, nonce: nonce.value, token: token.value });
    }

    if (!infos || !infos._id) return <Navigate to="/" />
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
                    <PKCEComponent />
                    <div className="user__container__infos__btngroup">
                        <SubmitComponent path={"http://localhost:3001/update-user"} method={"PUT"} dataForm={dataForm} btnValue={"Editer"} redirectTo={"/user"} />
                        <Link to="/user" className="button btn-danger">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default EditUser;