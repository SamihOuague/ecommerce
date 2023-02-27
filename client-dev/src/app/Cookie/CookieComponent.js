import React, { useState } from "react";
import { Link } from "react-router-dom";

function CookieComponent() {
    let [ acceptCookie, setAcceptCookie ] = useState();
    
    return (
        <div className={`cookie ${(acceptCookie) ? 'disabled' : ''}`}>
            <p className="cookie--text">
                Le site smokr-stuff.fr utilise des cookies essentiels ou facultatifs pour ameliorer nos services et votre experience utilisateur.
                <Link to="/CGU">En savoir plus</Link>
            </p>

            <div className="cookie__btngroup">
                <button className="cookie__btngroup--btn" onClick={() => { setAcceptCookie("all") }}>Tout Accepter</button>
                <button className="cookie__btngroup--btn" onClick={() => { setAcceptCookie("none") }}>Tout Refuser</button>
            </div>
        </div>
    );
}

export default CookieComponent;