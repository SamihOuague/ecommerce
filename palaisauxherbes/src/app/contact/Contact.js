import React from "react";

export const Contact = () => {
    return (
        <div className="contact">
            <h2 className="contact--title">Contact</h2>
            <div className="contact__container">
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