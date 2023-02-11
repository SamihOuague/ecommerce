import React, { useState } from "react";
import { PKCEComponent, SubmitComponent } from "../../PKCE/PKCEComponents";
import { Link, useSearchParams } from "react-router-dom";

function Register() {
    const [ dataForm, setDataForm ] = useState(null);
    const [ URLSearchParams ] = useSearchParams();
    const redirectTo = URLSearchParams.get("redirect_url");
    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, nonce, token } = e.target;
        let data = {
            email: email.value,
            password: password.value,
            nonce: nonce.value,
            token: token.value
        }
        setDataForm(data);
    }
    return (
        <div className="auth__container">
            <h2 className="auth--title">S'inscrire</h2>
            <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
                <input type="email" placeholder="Votre email" name="email" required />
                <input type="password" placeholder="Votre mot de passe" name="password" required />
                <input type="password" placeholder="Confirmer votre mot de passe" name="c_password" required />
                <div className="auth__container__form__linkgroup">
                    <Link to={`/auth${(redirectTo) ? `?redirect_url=${redirectTo}` : ''}`}>Se Connecter</Link>
                </div>
                <PKCEComponent/>
                <SubmitComponent path={"http://localhost:3001/register"} dataForm={dataForm} btnValue={"S'Inscrire"} redirectTo={redirectTo || "/"} />
            </form>
        </div>
    );
}

export default Register;