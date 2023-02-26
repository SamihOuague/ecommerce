import React, { useState } from "react";
import { SubmitComponent, PKCEComponent } from "../../PKCE/PKCEComponents";
import { Link } from "react-router-dom";

function ForgotPwd() {
    const [ dataForm, setDataForm ] = useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        setDataForm({email: e.target.email.value});
    }

    return (
        <div className="auth__container">
            <h2 className="reset--title">Mot de passe oublie</h2>
            <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
                <input type="email" placeholder="Votre email" name="email" required />
                <div>
                    <Link to="/auth">Se connecter</Link>
                </div>
                <PKCEComponent/>
                <SubmitComponent dataForm={dataForm} path={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_AUTH}/forgot-password`} btnValue={"Envoyer"}/>
            </form>
        </div>
    )
}

export default ForgotPwd;