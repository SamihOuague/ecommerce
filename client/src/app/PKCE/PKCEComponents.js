import React from "react";
import { Resources, Spinner } from "../Resources/Resources";
import { sha256 } from "js-sha256";
import { Navigate } from "react-router-dom";

export const PKCEComponent = () => {
    const nonce = String(Math.floor(Math.random() * (Math.pow(10, 10))));
    return (
        <Resources path={`${process.env.REACT_APP_API_URL}/auth/get-pkce?nonce=${sha256(nonce)}`} render={(data) => {
            if (data.loading) return <Spinner />
            else if (!data.payload || !data.payload.token) {
                return <p>Error PKCE</p>;
            }
            return (
                <>
                    <input type="hidden" name="nonce" value={nonce} style={{ margin: "8px 0" }} disabled />
                    <input type="hidden" name="token" value={data.payload.token} style={{ margin: "8px 0" }} disabled />
                </>
            );
        }} />
    );
}

export const SubmitComponent = ({ dataForm, btnValue, path, method, redirectTo }) => {
    return (!dataForm) ? <button className="button" type="submit">{btnValue}</button> :
        <Resources path={path}
            options={{
                method: method || "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Barear ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(dataForm),
            }}
            render={(data) => {
                if (data.loading) return <Spinner />;
                else if (!data.payload || data.errorCode) {
                    return (
                        <p>ERROR - 500</p>
                    );
                } else if (!data.payload.success) {
                    return (
                        <>
                            <span className="message">
                                <p className="message--elt">{data.payload.message}</p>
                            </span>
                            <button className="button" type="submit">{btnValue}</button>
                        </>
                    )
                }
                if (data.payload.token) localStorage.setItem("token", data.payload.token);
                return <Navigate to={(redirectTo) || "/"} />
            }}
        />
}