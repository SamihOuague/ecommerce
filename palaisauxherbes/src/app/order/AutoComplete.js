import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getInfosThunk } from "../user/userSlice";
import { setShippingInfos } from "./orderSlice";

const fetchAddress = async (address) => {
    return await (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address.replace(" ", "+")}`)).json();
}

const AutoComplete = () => {
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState("");
    const [lastVal, setLastVal] = useState("");
    const [selectedAddress, setSelectedAddress] = useState({});
    const { infos } = useSelector((state) => state.user);
    const { cart } = useSelector((state) => state.cart);
    const { shippingInfos } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
            phoneNumber: e.target.phoneNumber.value,
            address: e.target.address.value,
            zipcode: e.target.zipcode.value,
            city: e.target.city.value,
        }
        const { firstname, lastname, phoneNumber, address, zipcode, city } = data;
        if (firstname && lastname && phoneNumber && address && zipcode && city) {
            dispatch(setShippingInfos(data));
        }
    }

    const getAddresses = useCallback(async () => {
        if (lastVal.length < address.length && address.length > 6 && address.length % 3 === 0) {
            let response = await fetchAddress(address);
            setAddresses(response.features.map((v) => v.properties) || []);
        } else if (address.length <= 6) {
            setAddresses([]);
        }
        setLastVal(address);
    }, [address, lastVal]);

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
        dispatch(getInfosThunk());
    }, [dispatch, getAddresses]);

    if (cart.length === 0) return <Navigate to={"/"}/>
    const amount = cart.map((v) => (v.price*100) * v.qt).reduce((a, b) => a + b);
    if (shippingInfos) return <Navigate to={"/order"}/>
    else if (!infos) return (
        <div className="autocomplete">
            <div className="spinner-container">
                <i className="fa-solid fa-spinner"></i>
            </div>
        </div>
    );
    return (
        <div className="autocomplete">
            <h2 className="autocomplete--title">Checkout</h2>
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
                <h3>Contact information</h3>
                <label htmlFor="firstname">Firstname : </label>
                <input name="firstname" placeholder="Your firstname" defaultValue={infos.firstname} required/>
                <label htmlFor="lastname">Lastname : </label>
                <input name="lastname" placeholder="Your firstname" defaultValue={infos.lastname} required/>
                <label htmlFor="phoneNumber">Phone : </label>
                <input name="phoneNumber" placeholder="Your firstname" defaultValue={infos.phoneNumber} required/>
                <h3>Shipping information</h3>
                <div className="autocomplete__form__container">
                    <label htmlFor="phoneNumber">Address : </label>
                    <input defaultValue={selectedAddress.name} onChange={(e) => setAddress(e.target.value)} name="address" placeholder="Your address" type="text" autoComplete="off" required />
                    {(addresses.length > 0) && <div className="autocomplete__form__container__box">
                        {addresses.map((value, key) => (
                            <div key={key} onClick={(e) => handleSelectAddress(value, e)} className="autocomplete__form__container__box--elt">{value.label}</div>
                        ))}
                    </div>}
                </div>
                <input name="city" defaultValue={selectedAddress.city} placeholder="Your City" type="text" disabled />
                <input name="zipcode" defaultValue={selectedAddress.postcode} placeholder="Your Postal Code" type="text" disabled />
                <button className="button" type="submit">Checkout</button>
            </form>
        </div>
    );
}

export default AutoComplete;