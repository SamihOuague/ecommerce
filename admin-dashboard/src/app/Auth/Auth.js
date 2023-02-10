import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

const Auth = () => {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/"/>;
    return (
        <div className="auth">
            <Routes>
                <Route index path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
};

export default Auth;