import React from "react";
import { Link } from "react-router-dom";

export const Products = ({ data, addToCart }) => {
    const { prods, rates } = data;

    return (
        <div className="shop__overview">
            <div className="shop__overview__container">
                {prods.map((value, key) => (
                    <div className="shop__overview__container__card" key={key}>
                        <Link to={`/product/${value.categoryTag.replaceAll(" ", "-").toLowerCase()}/${value.title.replaceAll(" ", "-").toLowerCase()}`} className="shop__overview__container__card__info">
                            <img className="shop__overview__container__card__info--pic" src={`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/img/images/${value.img}`} alt="Product pic" />
                            <div className="container_sec">
                                <p className="shop__overview__container__card__info--tag">{value.categoryTag}</p>
                                <h3 className="shop__overview__container__card__info--title">{value.title}</h3>
                                <div className="shop__overview__container__card__info__stars">
                                    {[1, 2, 3, 4, 5].map((v, k) => (
                                        <i className={`${(v <= rates[value._id]) ? 'fa-solid' : 'fa-regular'} fa-star`} key={k}></i>
                                    ))}
                                </div>
                                <div className="shop__overview__container__card__info--price">
                                    <p>{value.price}$</p>
                                </div>
                            </div>
                        </Link>
                        <div className="button ext" onClick={() => addToCart(value)}>Ajouter au panier</div>
                    </div>
                ))}
            </div>
            <Pagination page={1} />
        </div>
    );
}

const Pagination = ({ page }) => {
    return (
        <div className="shop__overview__pagination">
            {(Number(page) <= 1) ?
                <div className="disabled">
                    <i className="fas fa-chevron-left"></i>
                </div> :
                <Link to={`/?page=${Number(page) - 1}`} onClick={() => this.forceUpdate()} className="button">
                    <i className="fas fa-chevron-left"></i>
                </Link>
            }
            <div className="button">1</div>
            {(page < 6) ?
                <div className="disabled">
                    <i className="fas fa-chevron-right"></i>
                </div> :
                <Link to={`/?page=${Number(page) + 1}`} onClick={() => this.forceUpdate()} className="button">
                    <i className="fas fa-chevron-right"></i>
                </Link>
            }
        </div>
    );
}