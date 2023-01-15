import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setRegister, registerThunk, loginThunk, setResetPwd, forgotPwdThunk } from "./authSlice";

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
            <div className="auth__container__form__linkgroup">
                <Link onClick={() => dispatch(setRegister(true))}>S'enregistrer</Link>
                <Link onClick={() => dispatch(setResetPwd(true))}>Mot de passe oublie ?</Link>
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
        if (data.password === e.target.c_password.value && data.password && data.firstname && data.lastname && data.email) dispatch(registerThunk(data));
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

const ForgotPwd = () => {
    const dispatch = useDispatch();
    const { reset_url } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.email.value) dispatch(forgotPwdThunk({email: e.target.email.value}));
    }

    return (
        <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
            {(reset_url && reset_url.url_id) && `https://localhost:3001/reset-pwd?url_id=${reset_url.url_id}`}
            <input type="email" placeholder="Votre email" name="email" required/>
            <div>
                <Link onClick={() => dispatch(setResetPwd(false))}>Se connecter</Link>
            </div>
            <button className="button">Reset Password</button>
        </form>
    )
}

const Auth = () => {
    const { register, token, resetPwd, loading } = useSelector((state) => state.auth);
    if (token) return  <Navigate to={"/"}/>; 
    else if (loading) return (
        <div className="auth">
            <div className="spinner-container">
                <i className="fa-solid fa-spinner"></i>
            </div>
        </div>
    )
    return (
        <div className="auth">
            <h2 className="auth--title">{(register) ? 'S\'Inscrire' : 'Se Connecter'}</h2>
            <div className="auth__container">
                {(!resetPwd) ?
                    <>{(register) ?
                        <Register /> :
                        <Login />
                        
                    }</> : <ForgotPwd />
                }
            </div>
        </div>
    );
};

export default Auth;