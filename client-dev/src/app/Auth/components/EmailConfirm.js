import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { Resources, Spinner } from "../../Resources/Resources";

const EmailConfirm = () => {
    const [ URLSearchParams ] = useSearchParams();
    const url_token = URLSearchParams.get("url_token");
    if (!url_token) return <Navigate to="/" />
    return(
        <div className="verify">
            <h2 className="verify--title">Email Confirmation</h2>
            <Resources path={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_AUTH}/verify-email?url_token=${url_token}`} options={{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }} render={(data) => {
                if (data.loading) return <Spinner/>
                return <p>{data.payload.message}</p>
            }}/>
        </div>
    );
}

export default EmailConfirm;