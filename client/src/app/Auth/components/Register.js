import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

function Register({ setToken }) {
    const [ loading, setLoading ] = useState(false);
    const [ redirect, setRedirect ] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            email: e.target.email.value,
            password: e.target.password.value,
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
        }
        setLoading(true);
        fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/auth/register", {
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
    if (redirect) return <Navigate to="/user"/>;
    return (
        <div className="auth__container">
            <h2 className="auth--title">S'inscrire</h2>
            <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder="Votre nom" name="lastname" required />
                <input type="text" placeholder="Votre prenom" name="firstname" required />
                <input type="email" placeholder="Votre email" name="email" required />
                <input type="password" placeholder="Votre mot de passe" name="password" required />
                <input type="password" placeholder="Confirmer votre mot de passe" name="c_password" required />
                <div>
                    <Link to="/auth">Se connecter</Link>
                </div>
                <button className={`${(loading) ? 'btn-disabled' : 'button'}`} disabled={loading}>{(loading) ? 'Loading...' : 'S\'Inscrire'}</button>
            </form>
        </div>
    );
}

export default Register;