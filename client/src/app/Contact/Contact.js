import React from "react";

function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
    }
    return (
        <div className="contact">
            <h2 className="contact--title">Nous Contacter</h2>
            <div className="contact__container">
                <div className="contact__container__informations">
                    <div>
                        <p><span><i className="fa-solid fa-phone"></i></span> 01 02 03 04 05</p>
                        <p><span><i className="fa-solid fa-at"></i></span> contact@palaisauxherbes.com</p>
                        <p><span><i className="fa-solid fa-location-dot"></i></span> 156 Rue de Paris, 91120, Palaiseau</p>
                        <p><span><i className="fa-solid fa-calendar-week"></i></span> Lun/Sam - 9h/20h </p>
                    </div>
                </div>
                <form className="contact__container__form" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" placeholder="Prenom Nom (*)" name="name" required/>
                    <input type="email" name="email" placeholder="Email (*)" required/>
                    <input type="text" name="subject" placeholder="Sujet (facultatif)" />
                    <textarea name="message" placeholder="Ecrivez votre message ici !"></textarea>
                    <input type="file" name="pj_file"/>
                    <button className="button" type="submit">Envoyer</button>
                </form>
            </div>
        </div>
    )
}

export default Contact;