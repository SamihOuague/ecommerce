import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPwd from "./components/ForgotPwd";
import ResetPwd from "./components/ResetPwd";

const Auth = () => {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/"/>;
    return (
        <div className="auth">
            <Routes>
                <Route index path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPwd />} />
                <Route path="/forgot-password" element={<ForgotPwd />} />
            </Routes>
        </div>
    );
};

export default Auth;