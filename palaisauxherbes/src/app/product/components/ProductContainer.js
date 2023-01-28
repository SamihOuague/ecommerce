import React from "react"
import { Link } from "react-router-dom";

export const ProductContainer = ({ prod }) => {
    return (
        <div className="product__container">
            <div className="product__container__img">
                <img src={`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/img/images/${prod.img}`} alt="product pic" className="product__container__img--img" />
            </div>
            <div className="product__container__details">
                <h3 className="product__container__details--title">{prod.title}</h3>
                <div className="product__container__details__values">
                    <div className="product__container__details__values__labels">
                        <p className="product__container__details__values__labels--text">Prix</p>
                        <p className="product__container__details__values__labels--text">Poids</p>
                        {(prod.aroma) && <p className="product__container__details__values__labels--text">Arome</p>}
                        <p className="product__container__details__values__labels--text">Type</p>
                        <p className="product__container__details__values__labels--text">Disponibilite</p>
                        <p className="product__container__details__values__labels--text">Quantite</p>
                    </div>
                    <div className="product__container__details__values__val">
                        <p className="product__container__details__values__val--text">{prod.price} $</p>
                        <p className="product__container__details__values__val--text"><span>{prod.weight}gr.</span></p>
                        {(prod.aroma) && <p className="product__container__details__values__val--text"><span>{prod.aroma}</span></p>}
                        <p className="product__container__details__values__val--text">{prod.categoryTag}</p>
                        <p className="product__container__details__values__val--text green">En Stock!</p>
                        <div className="product__container__details__values__val__btngroup">
                            <div className="button" onClick={() => console.log("")}>
                                <i className="fas fa-minus"></i>
                            </div>
                            <div className="cart__elt__container__product__body__btngroup--qt">{1}</div>
                            <div className="button" onClick={() => console.log("")}>
                                <i className="fas fa-plus"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product__container__details__btngroup">
                    <div className="button" onClick={() => console.log("")}>
                        <span>AJOUTER AU PANIER</span>
                    </div>
                    <div className="button" onClick={() => console.log("")}>
                        <span>ACHETER</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const ProductInfos = ({ prod }) => {
    return (
        <div className="product__infos">
            <div className="product__infos__nav">
                <div className="product__infos__nav__btngroup">
                    <div className={`button ${(true) && 'active'}`} onClick={() => console.log("")}>
                        <span>DESCRIPTION PRODUIT</span>
                    </div>
                    <div className={`button ${(false) && 'active'}`} onClick={() => console.log("")}>
                        <span>AVIS</span>
                    </div>
                </div>
            </div>
            {(true) ?
                <div className="product__infos__body">
                    <div dangerouslySetInnerHTML={{ __html: (prod.describ) ? prod.describ : "<p>No description to show.</p>" }}></div>
                </div> :
                <div className="product__infos__body">
                    <h5 className="product__infos__body--title">Avis</h5>
                    <form className="product__infos__body__create-review" onSubmit={(e) => console.log("")}>
                        <textarea placeholder="Write your comment here" name="comment"></textarea>
                        <button className="product__infos__body__create-review__review-rate">
                            {[1, 2, 3, 4, 5].map((v, k) => (
                                <i className={`${(v <= 4) ? 'fa-solid' : 'fa-regular'} fa-star`}
                                    onMouseEnter={() => console.log("")}
                                    onMouseLeave={() => console.log("")}
                                    key={k}></i>
                            ))}
                        </button>
                    </form>
                    {(false) ?
                        <div className="product__infos__body__reviews">
                            {/*comments.map((value, key) => (
                                <div className="product__infos__body__reviews__review" key={key}>
                                    <div className="product__infos__body__reviews__review__group">
                                        <h5 style={{ marginRight: "8px" }}>{value.username}</h5>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((v, k) => (
                                                <i className={`${(v <= value.rate) ? 'fa-solid' : 'fa-regular'} fa-star`} key={k}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p>{value.comment}</p>
                                </div>
                            ))*/}
                        </div>
                        : <p>Pas d'avis pour le moment.</p>
                    }
                </div>
            }
        </div>
    );
}

export const ProductRecommended = ({ recommended, rates }) => {
    return (
        <div className="product__recommended">
            <h3 className="product__recommended--title">Produits Recommandes</h3>
            <div className="product__recommended__container">
                {recommended.map((value, key) => (
                    <div className="box" key={key}>
                        <div className="product__recommended__container__card">
                            <Link to={`/product/${value.categoryTag.replaceAll(" ", "-").toLowerCase()}/${value.title.replaceAll(" ", "-").toLowerCase()}`} className="shop__overview__container__card__info">
                                <img className="product__recommended__container__card__info--pic" src={`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/img/images/${value.img}`} alt="Product pic" />
                                <p className="product__recommended__container__card__info--tag"></p>
                                <h3 className="product__recommended__container__card__info--title">{value.title}</h3>
                                <div className="product__recommended__container__card__info__stars">
                                    {[1, 2, 3, 4, 5].map((v, k) => (
                                        <i className={`${(v <= rates[value._id]) ? 'fa-solid' : 'fa-regular'} fa-star`} key={k}></i>
                                    ))}
                                </div>
                                <div className="product__recommended__container__card__info--price">
                                    <p>{value.price}</p>
                                </div>
                            </Link>
                            <div className="button">Add to cart</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}