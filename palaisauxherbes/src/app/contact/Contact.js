import React from "react";

export const Contact = () => {
    return (
        <div className="contact">
            <h2 className="contact--title">Contact Informations</h2>
            <div className="contact__container">
                <div className="contact__container__informations">
                    <div>
                        <p><span><i className="fa-solid fa-phone"></i></span> 01 02 03 04 05</p>
                        <p><span><i className="fa-solid fa-at"></i></span> contact@palaisauxherbes.com</p>
                        <p><span><i className="fa-solid fa-location-dot"></i></span> 156 Rue de Paris, 91120, Palaiseau</p>
                        <p><span><i className="fa-solid fa-calendar-week"></i></span> Lun/Sam - 9h/20h </p>
                    </div>
                </div>
                <form className="contact__container__form">
                    <input type="text" placeholder="Prenom Nom (*)" name="name" required/>
                    <input type="email" placeholder="Email (*)" required/>
                    <input type="text" placeholder="Sujet (facultatif)" />
                    <textarea placeholder="Ecrivez votre message ici !"></textarea>
                    <input type="file" name="pj_file"/>
                    <button className="button">Envoyer</button>
                </form>
            </div>
        </div>
    )
}