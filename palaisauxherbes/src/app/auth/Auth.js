import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setRegister, registerThunk, loginThunk } from "./authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            email: e.target.email.value,
            password: e.target.password.value,
        }
        if (data.email && data.password) dispatch(loginThunk(data));
    }
    return (
        <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
            <input type="email" placeholder="Votre email" name="email" required/>
            <input type="password" placeholder="Votre mot de passe" name="password" required/>
            <div>
                <Link onClick={() => dispatch(setRegister(true))}>S'enregistrer</Link>
            </div>
            <button className="button">Se Connecter</button>
        </form>
    );
}

const Register = () => {
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            email: e.target.email.value,
            password: e.target.password.value,
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
        }
        if (data.password === e.target.c_password.value && data.password && data.firtname && data.lastname && data.email) dispatch(registerThunk(data));
    }
    return (
        <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Votre Nom" name="lastname" required/>
            <input type="text" placeholder="Votre Prenom" name="firstname" required/>
            <input type="email" placeholder="Votre email" name="email" required/>
            <input type="password" placeholder="Votre mot de passe" name="password" required/>
            <input type="password" placeholder="Confirmer votre mot de passe" name="c_password" required/>
            <div>
                <Link onClick={() => dispatch(setRegister(false))}>Se connecter</Link>
            </div>
            <button className="button">S'Inscrire</button>
        </form>
    );
}

const Auth = () => {
    const { register, token } = useSelector((state) => state.auth);
    if (token) return  <Navigate to={"/"}/>; 
    return (
        <div className="auth">
            <h2 className="auth--title">{(register) ? 'S\'Inscrire' : 'Se Connecter'}</h2>
            <div className="auth__container">
                {(register) ?
                    <Register /> :
                    <Login />
                }
            </div>
        </div>
    );
};

export default Auth;