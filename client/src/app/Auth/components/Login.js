import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

function Login({ setToken }) {
    const [ loading, setLoading ] = useState(false);
    const [ redirect, setRedirect ] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            email: e.target.email.value,
            password: e.target.password.value,
        }
        if (!data.email || !data.password) return;
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async (res) => {
            let r = await res.json();
            if (r.success) {
                localStorage.setItem("token", r.token);
                setToken(r.token);
                setRedirect(true);
            }
            setLoading(false);
        }).catch((e) => {
            console.log(e);
            setLoading(false);
        });
    }

    if (redirect) return <Navigate to="/" />
    return (
        <div className="auth__container">
            <h2 className="auth--title">Se Connecter</h2>
            <form className="auth__container__form" onSubmit={(e) => (!loading) && handleSubmit(e)}>
                <input type="email" placeholder="Votre email" name="email" required />
                <input type="password" placeholder="Votre mot de passe" name="password" required />
                <div className="auth__container__form__linkgroup">
                    <Link to="/auth/register">S'enregistrer</Link>
                    <Link to="/auth/forgot-password">Mot de passe oublie ?</Link>
                </div>
                <button className={`${(!loading) ? 'button' : 'btn-disabled'}`} disabled={loading}>{(!loading) ? 'Se Connecter' : 'Loading...'}</button>
            </form>
        </div>
    );
}

export default Login;