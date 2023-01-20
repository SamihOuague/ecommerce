import React, { useState, useEffect, useCallback } from "react";

const fetchAddress = async (address) => {
    return await (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address.replace(" ", "+")}`)).json();
}

const AutoComplete = () => {
    const [ addresses, setAddresses ] = useState([]);
    const [ address, setAddress ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    const getAddresses = useCallback(async () => {
        if (address.length > 6) {
            let response = await fetchAddress(address);
            setAddresses(response.features.map((v) => v.properties) || []);
        } else {
            setAddresses([]);
        }
    }, [address]);

    useEffect(() => {
        getAddresses();
    }, [getAddresses])

    return (
        <div className="autocomplete">
            <form className="autocomplete__form" onSubmit={(e) => handleSubmit(e)}>
                <div className="autocomplete__form__container">
                    <input onChange={(e) => setAddress(e.target.value)} name="address" placeholder="Your address" type="text"/>
                    <div className="autocomplete__form__container__box">
                        {addresses.map((value, key) => (
                            <div key={key} className="autocomplete__form__container__box--elt">{value.label}</div>
                        ))}
                    </div>
                </div>
                <input name="city" placeholder="Your City" type="text" disabled/>
                <input name="zipcode" placeholder="Your Postal Code" type="text" disabled/>
                <button className="button" type="submit">Checkout</button>
            </form>
        </div>
    );
}

export default AutoComplete;