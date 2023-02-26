import React, { useState } from "react";
import { PKCEComponent, SubmitComponent } from "../../PKCE/PKCEComponents";
import { Link, useSearchParams } from "react-router-dom";

function Login() {
    const [ dataForm, setDataForm ] = useState(null);
    const [ URLSearchParams ] = useSearchParams();
    const redirectTo = URLSearchParams.get("redirect_url");
    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, nonce, token } = e.target;
        const data = {
            email: email.value,
            password: password.value,
            nonce: nonce.value,
            token: token.value,
        };
        e.target.password.value = "";
        setDataForm(data);
    }

    return (
        <div className="auth__container">
            <h2 className="auth--title">Se Connecter</h2>
            <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
                <input type="email" placeholder="Votre email" name="email" required />
                <input type="password" placeholder="Votre mot de passe" name="password" required />
                <div className="auth__container__form__linkgroup">
                    <Link to={`/auth/register${(redirectTo) ? `?redirect_url=${redirectTo}` : ''}`}>S'enregistrer</Link>
                    <Link to="/auth/forgot-password">Mot de passe oublie ?</Link>
                </div>
                <PKCEComponent />
                <SubmitComponent dataForm={dataForm} btnValue={"Se Connecter"} path={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_AUTH}/login`} redirectTo={redirectTo || "/"}/>
            </form>
        </div>
    );
}

export default Login;