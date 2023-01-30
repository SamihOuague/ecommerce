import React, { useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmailThunk } from "./authSlice";

const VerifyEmail = () => {
    const [ URLSearchParams ] = useSearchParams();
    const url_token = URLSearchParams.get("url_token");
    const { loading, msg, redirect } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(verifyEmailThunk(url_token));
    }, [dispatch, url_token]);
    if (!url_token || redirect) return <Navigate to={"/user"}/>
    return(
        <div className="verify">
            <h2 className="verify--title">Email Confirmation</h2>
            {(loading) ? <p>Please wait...</p> : <p>{msg}</p>}
        </div>
    );
}

export default VerifyEmail;