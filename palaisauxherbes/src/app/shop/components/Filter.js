import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const Categories = ({ cat, setPathUri, pathUri }) => {
    const [categories, setCategories] = useState(cat);

    const handleShowCat = (id) => {
        let c = [...categories];
        let elt = c.find((v) => v._id === id);
        elt.show = !elt.show;
        setCategories(c);
    }

    return (
        <div className="shop__filter__section__body">
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
                                    <Link to={`/${value.category.replaceAll(" ", "-").toLowerCase()}/${v.name.replaceAll(" ", "-").toLowerCase()}`}>
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

const Availability = ({ nb_prod, setProdFilter, prodFilter }) => {
    const [availableCheckBox, setAvailableCheckBox] = useState({ in: false, out: false });
    const availableCount = nb_prod;

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
                <div className="button"
                    onClick={() => {
                        if (availableCheckBox.in || availableCheckBox.out) {
                            setProdFilter({
                                ...prodFilter,
                                available: (availableCheckBox.in) ? "in" : "out",
                            });
                        } else setProdFilter({ ...prodFilter, available: null });

                    }}>APPLIQUER</div>
            </div>
        </div>
    );
}

const PriceFilter = ({ highestPrice, setProdFilter, prodFilter }) => {
    const [priceInterval, setPriceInterval] = useState({ min: 0, max: 0 });
    return (
        <div className="shop__filter__section__body">
            <p className="shop__filter__section__body--highest">Prix le plus elever <b>{highestPrice.price}$</b></p>
            <div className="shop__filter__section__body__input">
                <p className="shop__filter__section__body__input--label">Prix min <b>$</b></p>
                <input className="shop__filter__section__body__input--field"
                    value={(priceInterval.min) ? priceInterval.min : ""}
                    name="from" min={0}
                    type="number"
                    onChange={(e) => setPriceInterval({ ...priceInterval, min: Number(e.target.value) })}
                />
            </div>
            <div className="shop__filter__section__body__input">
                <p className="shop__filter__section__body__input--label">Prix max <b>$</b></p>
                <input className="shop__filter__section__body__input--field"
                    value={(priceInterval.max) ? priceInterval.max : ""}
                    name="to" min={0}
                    max={highestPrice.price}
                    type="number"
                    onChange={(e) => setPriceInterval({ ...priceInterval, max: Number(e.target.value) })}
                />
            </div>
            <div className="shop__filter__section__body__btngroup">
                <div className="button" onClick={() => setPriceInterval({ min: 0, max: 0 })}>EFFACER</div>
                <div className="button" onClick={() => {
                    if (priceInterval.min || priceInterval.max) {
                        setProdFilter({
                            ...prodFilter,
                            pricemin: (priceInterval.min) ? priceInterval.min : null,
                            pricemax: (priceInterval.max) ? priceInterval.max : null,
                        });
                    } else setProdFilter({ ...prodFilter, pricemin: null, pricemax: null });
                }}>APPLIQUER</div>
            </div>
        </div>
    );
}

export const Filter = ({ data, setPathUri, pathUri }) => {
    const { cat, nb_prod, highestPrice } = data;
    const [prodFilter, setProdFilter] = useState({ page: 1 });

    const handleSetFilter = useCallback((f) => {
        let filterUriArray = [];
        let filterUri = "";
        for (let i = 0, filterKeys = Object.keys(f); i < filterKeys.length; i++)
            if (f[filterKeys[i]]) filterUriArray.push(`${filterKeys[i]}=${f[filterKeys[i]]}`);
        for (let i = 0; i < filterUriArray.length; i++) {
            if (i === 0) filterUri += "?"
            filterUri += filterUriArray[i];
            if (i !== filterUriArray.length - 1) filterUri += "&";
        }
        setPathUri(`${pathUri.split("?")[0]}${filterUri}`);

    }, [setPathUri, pathUri]);

    useEffect(() => {
        handleSetFilter(prodFilter);
    }, [prodFilter, handleSetFilter]);

    return (
        <div className="shop__filter">
            <div className="shop__filter__section">
                <h5 className="shop__filter__section--title">Categories</h5>
                <Categories cat={cat} setPathUri={setPathUri} pathUri={pathUri} />
            </div>
            <div className="shop__filter__section">
                <h5 className="shop__filter__section--title">Disponibilite</h5>
                <Availability setProdFilter={setProdFilter} prodFilter={prodFilter} nb_prod={nb_prod} />
            </div>
            <div className="shop__filter__section">
                <h5 className="shop__filter__section--title">Price</h5>
                <PriceFilter highestPrice={highestPrice} setProdFilter={setProdFilter} prodFilter={prodFilter} />
            </div>
        </div>
    );
}