import React, { useState } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";

export const Products = ({ data, addToCart, handleGetFilterUri, prodFilter }) => {
    const { prods, rates } = data;
    const [URLSearchParams] = useSearchParams();
    const page = Number(URLSearchParams.get("page")) || 1;
    const { name, category } = useParams();
    const [showCat, setShowCat] = useState();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleSortBy = (e) => {
        let { value } = e.target;
        let filter = handleGetFilterUri({ ...prodFilter, sortby: value });
        let url = `/${filter}`;
        if (name && category) {
            url = `/category/${category}/${name}${filter}`;
        }
        navigate(url);
    }
    return (
        <div className="shop__overview">
            <div className="shop__overview__mobile-category">
                <div className="shop__overview__mobile-category__btngroup">
                    <div className="shop__overview__mobile-category__btngroup--button" onClick={() => setShow(!show)}>
                        <i className="fa-solid fa-bars"></i>
                    </div>
                    <select onChange={(e) => handleSortBy(e)} defaultValue={URLSearchParams.get("sortby")}>
                        <option value={""}>Trier par</option>
                        <option value={"pricelow"}>Prix croissant</option>
                        <option value={"pricehigh"}>Prix decroissant</option>
                        <option value={"alphaz"}>Ordre alphabetique, A - Z</option>
                        <option value={"zalpha"}>Ordre alphabetique, Z - A</option>
                    </select>
                </div>
                <div className={`shop__overview__mobile-category__section ${(show) ? 'show' : 'hide'}`}>
                   
                </div>
            </div>
            <div className="shop__overview__container">
                {prods.map((value, key) => (
                    <div className="shop__overview__container__card" key={key}>
                        <Link to={`/product/${value.categoryTag.replaceAll(" ", "-").toLowerCase()}/${value.title.replaceAll(" ", "-").toLowerCase()}`} className="shop__overview__container__card__info">
                            <img className="shop__overview__container__card__info--pic" src={`${process.env.REACT_APP_API_URL}/img/images/${value.img}`} alt="Product pic" />
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
            <Pagination page={page} nbProd={prods.length} name={name} category={category} />
        </div>
    );
}

const Pagination = ({ page, nbProd, name, category }) => {
    return (
        <div className="shop__overview__pagination">
            {(Number(page) <= 1) ?
                <div className="disabled">
                    <i className="fas fa-chevron-left"></i>
                </div> :
                <Link to={`${(name && category) ? `/category/${category}/${name}` : ''}/?page=${Number(page) - 1}`} className="button">
                    <i className="fas fa-chevron-left"></i>
                </Link>
            }
            <div className="button">{page}</div>
            {(nbProd !== 6) ?
                <div className="disabled">
                    <i className="fas fa-chevron-right"></i>
                </div> :
                <Link to={`${(name && category) ? `/category/${category}/${name}` : ''}/?page=${Number(page) + 1}`} className="button">
                    <i className="fas fa-chevron-right"></i>
                </Link>
            }
        </div>
    );
}