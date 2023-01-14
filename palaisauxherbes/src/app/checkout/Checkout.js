import React from "react";

export const Checkout = () => {
    return (
        <div className="checkout">
            <div className="checkout__container">
                <div className="checkout__container__check">
                    <form className="checkout__container__check__form">
                        <div className="checkout__container__check__form__contact-info">
                            <h3>Contact information</h3>
                            <input type="email" placeholder="Enter your email" name="email"/>
                            <input type="tel" placeholder="Enter your phone number" name="tel"/>
                        </div>
                        <div className="checkout__container__check__form__shipping-info">
                            <h3>Shipping information</h3>
                            <select name="country">
                                <option>Country</option>
                            </select>
                            <div className="checkout__container__check__form__shipping-info__group">
                                <input type="text" placeholder="Firstname" name="firstname"/>
                                <input type="text" placeholder="Lastname" name="lastname"/>
                            </div>
                            <input type="text" placeholder="Address" name="address"/>
                            <input type="text" placeholder="Appartment, suit .. (Optional)" name="option"/>
                            <div className="checkout__container__check__form__shipping-info__group">
                                <input type="text" placeholder="Postal Code" name="postal"/>
                                <input type="text" placeholder="City" name="city"/>
                            </div>

                        </div>
                    </form>
                </div>
                <div className="checkout__container__cart">
                    <div className="checkout__container__cart__products">
                        <div className="checkout__container__cart__products--elt">
                            
                        </div>
                    </div>
                    <div className="checkout__container__cart__bill">

                    </div>
                    <div className="checkout__container__cart__total">

                    </div>
                </div>
            </div>
        </div>
    );
}