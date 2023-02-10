import React from "react";
import { useSearchParams } from "react-router-dom";

function ResetPwd() {
    const loading = false;
    const [ URLSearchParams ] = useSearchParams();
    const url_token = URLSearchParams.get("url_token");

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            password: e.target.password.value,
            url_token,
        }
        if (e.target.password.value === e.target.c_password.value && data.url_token) {
            console.log(data);
        }
    }
    
    return (
        <div className="reset">
            <h2 className="reset--title">Reset Password</h2>
            <div className="reset__container">
                <form onSubmit={(e) => handleSubmit(e)} className="reset__container__form">
                    <input type="password" placeholder="New password" name="password"/>
                    <input type="password" placeholder="Confirm password" name="c_password"/>
                    <button className="button" type="submit" disabled={loading}>{(loading)? "Loading..." : "Change password"}</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPwd;