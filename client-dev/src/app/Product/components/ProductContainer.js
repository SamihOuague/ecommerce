import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ReviewsResource } from "./ReviewsResources";

export const ProductContainer = ({ prod, addToCart }) => {
    const [ quantity, setQuantity ] = useState(1);
    const navigate = useNavigate();
    const handleBuyNow = () => {
        addToCart({...prod}, quantity);
        navigate("/order");
    }
    return (
        <div className="product__container">
            <h3 className="product__container--title">{prod.title}</h3>
            <div className="product__container__img">
                <img src={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_IMG}/images/${prod.img}`} alt="product pic" className="product__container__img--img" />
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
                            <button className="button" onClick={() => (quantity > 1) && setQuantity(quantity - 1)}>
                                <i className="fas fa-minus"></i>
                            </button>
                            <div className="product__container__details__values__val__btngroup--qt">{quantity}</div>
                            <button className="button" onClick={() => setQuantity(quantity + 1)}>
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="product__container__details__btngroup">
                    <div className="button" onClick={() => addToCart({...prod}, quantity)}>
                        <span>AJOUTER AU PANIER</span>
                    </div>
                    <div className="button" onClick={() => handleBuyNow()}>
                        <span>ACHETER</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const ProductRecommended = ({ recommended, rates, addToCart }) => {
    return (
        <div className="product__recommended">
            <h3 className="product__recommended--title">Produits Recommandes</h3>
            <div className="product__recommended__container">
                {recommended.map((value, key) => (
                    <div className="box" key={key}>
                        <div className="product__recommended__container__card">
                            <Link to={`/product/${value.categoryTag.replaceAll(" ", "-").toLowerCase()}/${value.title.replaceAll(" ", "-").toLowerCase()}`} className="shop__overview__container__card__info">
                                <img className="product__recommended__container__card__info--pic" src={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_IMG}/images/${value.img}`} alt="Product pic" />
                                <p className="product__recommended__container__card__info--tag"></p>
                                <h3 className="product__recommended__container__card__info--title">{value.title}</h3>
                                <div className="product__recommended__container__card__info__stars">
                                    {[1, 2, 3, 4, 5].map((v, k) => (
                                        <i className={`${(v <= rates[value._id]) ? 'fa-solid' : 'fa-regular'} fa-star`} key={k}></i>
                                    ))}
                                </div>
                                <div className="product__recommended__container__card__info--price">
                                    <p>{value.price}$</p>
                                </div>
                            </Link>
                            <div className="button" onClick={() => addToCart(value)}>Add to cart</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const ProductInfos = ({ prod }) => {
    const [ showReviews, setShowReviews ] = useState(false);

    return (
        <div className="product__infos">
            <div className="product__infos__nav">
                <div className="product__infos__nav__btngroup">
                    <button className={`button ${(!showReviews) && 'active'}`} onClick={() => setShowReviews(false)}>
                        <span>DESCRIPTION PRODUIT</span>
                    </button>
                    <button className={`button ${(showReviews) && 'active'}`} onClick={() => setShowReviews(true)}>
                        <span>AVIS</span>
                    </button>
                </div>
            </div>
            {(!showReviews) ?
                <div className="product__infos__body">
                    <div dangerouslySetInnerHTML={{ __html: (prod.describ) ? prod.describ : "<p>No description to show.</p>" }}></div>
                </div> : <ReviewsResource id={prod._id} />
            }
        </div>
    );
}