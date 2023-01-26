import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setRegister, registerThunk, loginThunk, setResetPwd, forgotPwdThunk, setMsg } from "./authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const { msg } = useSelector((state) => state.auth);
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            email: e.target.email.value,
            password: e.target.password.value,
        }
        if (data.email && data.password) dispatch(loginThunk(data));
    }
    const handleRegister = () => {
        dispatch(setMsg(""));
        dispatch(setRegister(true));
    }

    const handleResetPwd = () => {
        dispatch(setMsg(""));
        dispatch(setResetPwd(true));
    }
    
    return (
        <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
            <input type="email" placeholder="Votre email" name="email" required/>
            <input type="password" placeholder="Votre mot de passe" name="password" required/>
            <div className="auth__container__form__linkgroup">
                <Link onClick={() => handleRegister()}>S'enregistrer</Link>
                <Link onClick={() => handleResetPwd()}>Mot de passe oublie ?</Link>
            </div>
            {(msg) && <p>{msg}</p>}
            <button className="button">Se Connecter</button>
        </form>
    );
}

const Register = () => {
    const dispatch = useDispatch();
    const { msg } = useSelector((state) => state.auth);
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
    const handleConnect = () => {
        dispatch(setMsg(""));
        dispatch(setRegister(false));
    }
    return (
        <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Votre nom" name="lastname" required/>
            <input type="text" placeholder="Votre prenom" name="firstname" required/>
            <input type="email" placeholder="Votre email" name="email" required/>
            <input type="password" placeholder="Votre mot de passe" name="password" required/>
            <input type="password" placeholder="Confirmer votre mot de passe" name="c_password" required/>
            <div>
                <Link onClick={() => handleConnect()}>Se connecter</Link>
            </div>
            {(msg) && <p>{msg}</p>}
            <button className="button">S'Inscrire</button>
        </form>
    );
}

const ForgotPwd = () => {
    const dispatch = useDispatch();
    const { msg, loading } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.email.value) dispatch(forgotPwdThunk({email: e.target.email.value}));
    }

    const handleConnect = () => {
        dispatch(setMsg(""));
        dispatch(setResetPwd(false))
    }

    return (
        <form className="auth__container__form" onSubmit={(e) => handleSubmit(e)}>
            <input type="email" placeholder="Votre email" name="email" required/>
            <div>
                <Link onClick={() => handleConnect()}>Se connecter</Link>
            </div>
            {msg && <p>{msg}</p>}
            <button className="button" disabled={loading}>Reinitialiser</button>
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
            {(!resetPwd) ? <h2 className="auth--title">{(register) ? 'S\'Inscrire' : 'Se Connecter'}</h2> : <h2 className="auth--title">Recuperation</h2>}
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