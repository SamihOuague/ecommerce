import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPwd() {
    const [ loading, setLoading ] = useState(false);
    const [ msg, setMsg ] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: e.target.email.value})
        }).then(async (res) => {
            let r = await res.json();
            if (r) setMsg("Un email de recuperation viens d'etre envoyer, verifier vos spam !");
            else setMsg("Email introuvable ou inexistant.");
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setMsg("Email introuvable ou inexistant.");
            setLoading(false);
        });
    }

    return (
        <div className="auth__container">
            <h2 className="reset--title">Mot de passe oublie</h2>
            <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
                <input type="email" placeholder="Votre email" name="email" required />
                <div>
                    <Link to="/auth">Se connecter</Link>
                </div>
                <p>{msg}</p>
                <button className={`${(loading) ? 'btn-disabled' : 'button'}`} disabled={loading}>{(loading) ? 'Loading...' : 'Reinitialiser'}</button>
            </form>
        </div>
    )
}

export default ForgotPwd;