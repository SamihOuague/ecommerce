import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Categories = ({ cat, prodFilter, handleGetFilterUri }) => {
    const [categories, setCategories] = useState(cat);

    const handleShowCat = (id) => {
        let c = [...categories];
        let elt = c.find((v) => v._id === id);
        elt.show = !elt.show;
        setCategories(c);
    }

    return (
        <div className="shop__filter__section__body">
            <Link to={"/"} className="shop__filter__section__body__category__elt__title">
                <span>Tous Nos Produits</span>
                <i className="fas fa-plus"></i>
            </Link>
            <ul className="shop__filter__section__body__category">
                {categories.map((value, key) => (
                    <li className="shop__filter__section__body__category__elt" key={key}>
                        <div className="shop__filter__section__body__category__elt__title" onClick={() => handleShowCat(value._id)}>
                            <span>{value.category}</span>
                            {(!value.show) ?
                                <i className="fas fa-plus"></i> : <i className="fas fa-minus"></i>
                            }
                        </div>
                        <ul className={`shop__filter__section__body__category__elt__list ${(value.show) ? 'showcate' : 'hidecate'}`}>
                            {value.subcategory.map((v, k) => (
                                <li className="shop__filter__section__body__category__elt__list--item" key={k}>
                                    <Link to={`/category/${value.category.replaceAll(" ", "-").toLowerCase()}/${v.name.replaceAll(" ", "-").toLowerCase()}${handleGetFilterUri(prodFilter)}`}>
                                        {v.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const Availability = ({ nb_prod, prodFilter, handleGetFilterUri }) => {
    const [availableCheckBox, setAvailableCheckBox] = useState({ in: prodFilter.available === "in", out: prodFilter.available === "out" });
    const availableCount = nb_prod;
    useEffect(() => {
        setAvailableCheckBox({ in: prodFilter.available === "in", out: prodFilter.available === "out" });
    }, [setAvailableCheckBox, prodFilter]);
    return (
        <div className="shop__filter__section__body">
            <div className="shop__filter__section__body__availability" onClick={() => {
                (!availableCheckBox.in) && setAvailableCheckBox({ out: false, in: true })
            }}>
                <div className="shop__filter__section__body__availability--select">
                    {(availableCheckBox.in) && <div></div>}
                </div>
                <div className="shop__filter__section__body__availability__elt">
                    <span>Disponible</span>
                    <span>({availableCount.in})</span>
                </div>
            </div>
            <div className="shop__filter__section__body__availability" onClick={() => {
                (!availableCheckBox.out) && setAvailableCheckBox({ in: false, out: true })
            }}>
                <div className="shop__filter__section__body__availability--select">
                    {(availableCheckBox.out) && <div></div>}
                </div>
                <div className="shop__filter__section__body__availability__elt">
                    <span>Rupture de Stock</span>
                    <span>({availableCount.out})</span>
                </div>
            </div>
            <div className="shop__filter__section__body__btngroup">
                <div className="button" onClick={() => setAvailableCheckBox({ in: false, out: false })}>EFFACER</div>
                <Link className="button" to={handleGetFilterUri({
                    ...prodFilter,
                    available: (availableCheckBox.in || availableCheckBox.out) ? (availableCheckBox.in) ? "in" : "out" : null,
                })}>APPLIQUER</Link>
            </div>
        </div>
    );
}

const PriceFilter = ({ highestPrice, handleGetFilterUri, prodFilter }) => {
    const [priceInterval, setPriceInterval] = useState({ pricemin: prodFilter.pricemax, pricemax: prodFilter.pricemin });
    useEffect(() => {
        setPriceInterval({ pricemin: prodFilter.pricemin, pricemax: prodFilter.pricemax });
    }, [setPriceInterval, prodFilter]);
    return (
        <div className="shop__filter__section__body">
            <p className="shop__filter__section__body--highest">Prix le plus elever <b>{highestPrice.price}$</b></p>
            <div className="shop__filter__section__body__input">
                <p className="shop__filter__section__body__input--label">Prix min <b>$</b></p>
                <input className="shop__filter__section__body__input--field"
                    value={(priceInterval.pricemin) ? priceInterval.pricemin : ""}
                    name="from" min={0}
                    type="number"
                    onChange={(e) => setPriceInterval({ ...priceInterval, pricemin: Number(e.target.value) })}
                />
            </div>
            <div className="shop__filter__section__body__input">
                <p className="shop__filter__section__body__input--label">Prix max <b>$</b></p>
                <input className="shop__filter__section__body__input--field"
                    value={(priceInterval.pricemax) ? priceInterval.pricemax : ""}
                    name="to" min={0}
                    max={highestPrice.price}
                    type="number"
                    onChange={(e) => setPriceInterval({ ...priceInterval, pricemax: Number(e.target.value) })}
                />
            </div>
            <div className="shop__filter__section__body__btngroup">
                <div className="button" onClick={() => setPriceInterval({ pricemax: 0, pricemin: 0 })}>EFFACER</div>
                <Link className="button" to={handleGetFilterUri({ ...prodFilter, ...priceInterval })}>APPLIQUER</Link>
            </div>
        </div>
    );
}

export const Filter = ({ data, handleGetFilterUri, prodFilter }) => {
    const { cat, nb_prod, highestPrice } = data;

    return (
        <div className="shop__filter">
            <div className="shop__filter__section">
                <h5 className="shop__filter__section--title">Categories</h5>
                <Categories cat={cat} prodFilter={prodFilter} handleGetFilterUri={handleGetFilterUri} />
            </div>
            <div className="shop__filter__section">
                <h5 className="shop__filter__section--title">Disponibilite</h5>
                <Availability prodFilter={prodFilter} nb_prod={nb_prod} handleGetFilterUri={handleGetFilterUri} />
            </div>
            <div className="shop__filter__section">
                <h5 className="shop__filter__section--title">Price</h5>
                <PriceFilter highestPrice={highestPrice} handleGetFilterUri={handleGetFilterUri} prodFilter={prodFilter} />
            </div>
        </div>
    );
}