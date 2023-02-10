import React, { useEffect, useState } from "react";

export const Resources = ({ path, render, options }) => {
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(null);
    useEffect(() => {
        fetch(path, options || {}).then((res) => {
            return res.json();
        }).then((payload) => {
            setPayload(payload);
            setLoading(false);
        }).catch((e) => {
            setErrorCode(e);
            setLoading(false);
        });
    }, [path, options]);
    return render({ payload, loading, errorCode });
};

export const Spinner = () => {
    return (
        <div className="spinner-container">
            <i className="fa-solid fa-spinner"></i>
        </div>
    );
};