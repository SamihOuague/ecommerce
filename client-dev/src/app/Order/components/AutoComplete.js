import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";

const fetchAddress = async (address) => {
    return await (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address.replace(" ", "+")}`)).json();
}

function AutoComplete ({infos, setInfos}) {
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState("");
    const [lastVal, setLastVal] = useState("");
    const [selectedAddress, setSelectedAddress] = useState({});
    const [redirect, setRedirect] = useState(false);
    const cart = JSON.parse(localStorage.getItem("cart") || '[]');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
            phoneNumber: e.target.phoneNumber.value,
            address: e.target.address.value,
            zipcode: e.target.zipcode.value,
            city: e.target.city.value,
            email: infos.email
        }
        const { firstname, lastname, phoneNumber, address, zipcode, city } = data;
        if (firstname && lastname && phoneNumber && address && zipcode && city) { 
            setInfos(data);
            setRedirect(true);
        };
    }
    let regex = new RegExp(address, 'i');
    let lnt = addresses.filter((v) => regex.test(v.label)).length;
    const getAddresses = useCallback(async () => {
        if (lastVal.length < address.length && address.length > 6 && address.length % 3 === 0 && !lnt) {
            let response = await fetchAddress(address);
            setAddresses(response.features.map((v) => v.properties) || []);
        } else if (address.length <= 6) {
            setAddresses([]);
        }
        setLastVal(address);
    }, [address, lastVal, lnt]);

    const handleSelectAddress = (selected_address, e) => {
        const { postcode, city, name } = selected_address;
        if (postcode && city && name) {
            setSelectedAddress({ name, postcode, city });
            setAddresses([]);
            e.target.parentNode.parentNode.parentNode.address.value = name;
        }
    }
    useEffect(() => {
        getAddresses();
    }, [getAddresses]);


    if (!cart || !cart.length) return <Navigate to="/" />;
    else if (redirect) return <Navigate to="/order/payment" />;
    const amount = (cart.length) ? cart.map((v) => (v.price*100) * v.qt).reduce((a, b) => a + b) : 0;
    return (
        <div className="autocomplete">
            <h2 className="autocomplete--title">Enregistrement</h2>
            <div className="autocomplete__bill">
                <div className="autocomplete__bill__container">
                    {cart.map((v, k) => (
                        <div key={k} className="autocomplete__bill__container__product">
                            <p><i>{v.title} - x{v.qt}</i></p>
                            <p><i>{v.price}$</i></p>
                        </div>
                    ))}
                    <div className="autocomplete__bill__container__total">
                        <p><b>Total</b></p>
                        <p><b>{`${String(amount).substring(0, String(amount).length - 2)},${String(amount).substring(String(amount).length - 2)}$`}</b></p>
                    </div>
                </div>
            </div>
            <form className="autocomplete__form" onSubmit={(e) => handleSubmit(e)}>
                <h3>Informations</h3>
                <label htmlFor="firstname">Prenom : </label>
                <input name="firstname" placeholder="Votre Prenom" defaultValue={infos.firstname} required/>
                <label htmlFor="lastname">Nom : </label>
                <input name="lastname" placeholder="Votre Nom" defaultValue={infos.lastname} required/>
                <label htmlFor="phoneNumber">Tel. : </label>
                <input name="phoneNumber" placeholder="Numero de telephone" defaultValue={infos.phoneNumber} required/>
                <h3>Lieu De Livraison</h3>
                <div className="autocomplete__form__container">
                    <label htmlFor="phoneNumber">Adresse : </label>
                    <input defaultValue={selectedAddress.name} onChange={(e) => setAddress(e.target.value)} name="address" placeholder="Votre Adresse" type="text" autoComplete="off" required />
                    {(addresses.length > 0) && <div className="autocomplete__form__container__box">
                        {addresses.map((value, key) => (
                            <div key={key} onClick={(e) => handleSelectAddress(value, e)} className="autocomplete__form__container__box--elt">{value.label}</div>
                        ))}
                    </div>}
                </div>
                <input name="city" defaultValue={selectedAddress.city} placeholder="Votre Ville" type="text" disabled />
                <input name="zipcode" defaultValue={selectedAddress.postcode} placeholder="Votre Code Postal" type="text" disabled />
                <button className="button" type="submit">Continuer</button>
            </form>
        </div>
    );
}

export default AutoComplete;