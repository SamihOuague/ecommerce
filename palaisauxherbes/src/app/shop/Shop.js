import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showcat, getMainThunk, availableIn, availableOut, availableClear, getByCatThunk, fetchAvailableThunk, fetchPriceIntervalThunk, setIntervalPrice } from "./shopSlice";
import { addToCart } from "../cart/cartSlice";
import { Link, useSearchParams, useParams } from "react-router-dom";

export const Shop = () => {
    const { products, categories, availableCheckBox, availableCount, priceInterval, rates } = useSelector((state) => state.shop);
    const dispatch = useDispatch();
    const [ URLSearchParams ] = useSearchParams();
    const { name } = useParams();
    let page = 1;
    const handleFilter = () => {
        if (availableCheckBox.in || availableCheckBox.out) {
            dispatch(fetchAvailableThunk({page, filter: availableCheckBox.in ? "in" : "out"}));
        }
    }

    let getPage = useCallback(() => {
        if (!name) return dispatch(getMainThunk(page));
        else return  dispatch(getByCatThunk({page, name}));
    }, [dispatch, page, name]);
    
    if (URLSearchParams.get("page") && Number(URLSearchParams.get("page"))) page = URLSearchParams.get("page");
    
    useEffect(() => {
        getPage();
    }, [getPage]);
    
    if (categories === null || products === null) {
        return (
            <p>Loading...</p>
        );
    }
    return (
        <div className="shop">
            <div className="shop__filter">
                <div className="shop__filter__section">
                    <h5 className="shop__filter__section--title">Category</h5>
                    <div className="shop__filter__section__body">
                        <ul className="shop__filter__section__body__category">
                            {categories.map((value, index) => (
                                <li key={index} className="shop__filter__section__body__category__elt">
                                    <div className="shop__filter__section__body__category__elt__title" onClick={() => dispatch(showcat(value.category))}>
                                        <span>{value.category}</span>
                                        {(value.show !== "showcate") ?
                                            <i className="fas fa-plus"></i>
                                            :
                                            <i className="fas fa-minus"></i>
                                        }
                                    </div>
                                    <ul className={`shop__filter__section__body__category__elt__list ${value.show}`}>
                                        {value.subcategory.map((v, key) => (
                                            <li className="shop__filter__section__body__category__elt__list--item" key={key}>
                                                <Link to={`/${value.category.replaceAll(" ", "-").toLowerCase()}/${v.name.replaceAll(" ", "-").toLowerCase()}`}>{v.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="shop__filter__section">
                    <h5 className="shop__filter__section--title">Availability</h5>
                    <div className="shop__filter__section__body">
                        <div className="shop__filter__section__body__availability"  onClick={() => dispatch(availableIn())}>
                            <div className="shop__filter__section__body__availability--select">
                                {(availableCheckBox.in) && <div></div>}
                            </div>
                            <div className="shop__filter__section__body__availability__elt">
                                <span>In stock</span>
                                <span>({availableCount.in})</span>
                            </div>
                        </div>
                        <div className="shop__filter__section__body__availability" onClick={() => dispatch(availableOut())}>
                            <div className="shop__filter__section__body__availability--select">
                                {(availableCheckBox.out) && <div></div>}
                            </div>
                            <div className="shop__filter__section__body__availability__elt">
                                <span>Out of stock</span>
                                <span>({availableCount.out})</span>
                            </div>
                        </div>
                        <div className="shop__filter__section__body__btngroup">
                            <div className="button" onClick={() => dispatch(availableClear())}>CLEAR</div>
                            <div className="button" onClick={() => handleFilter()}>APPLY</div>
                        </div>
                    </div>
                </div>
                <div className="shop__filter__section">
                    <h5 className="shop__filter__section--title">Price</h5>
                    <div className="shop__filter__section__body">
                        <p className="shop__filter__section__body--highest">The highest price is 29.95$</p>
                        <div className="shop__filter__section__body__input">
                            <p className="shop__filter__section__body__input--label">From <b>$</b></p>
                            <input className="shop__filter__section__body__input--field" name="from" min={0} type="number" onChange={(e) => dispatch(setIntervalPrice({...priceInterval, min: e.target.value}))}/>
                        </div>
                        <div className="shop__filter__section__body__input">
                            <p className="shop__filter__section__body__input--label">To <b>$</b></p>
                            <input className="shop__filter__section__body__input--field" name="to" min={0} type="number" onChange={(e) => dispatch(setIntervalPrice({...priceInterval, max: e.target.value}))}/>
                        </div>
                        <div className="shop__filter__section__body__btngroup">
                            <div className="button">CLEAR</div>
                            <div className="button" onClick={() => dispatch(fetchPriceIntervalThunk({page, filter: priceInterval}))}>APPLY</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shop__overview">
                <div className="shop__overview__navbar">
                    <div className="shop__overview__navbar__btngroup">
                        <div className="shop__overview__navbar__btngroup--button active">
                            <i className="fas fa-th"></i>
                        </div>
                        <div className="shop__overview__navbar__btngroup--button">
                            <i className="fas fa-th-list"></i>
                        </div>
                    </div>
                    <div className="shop__overview__navbar__sort">
                        <p className="shop__overview__navbar__sort--label">Sort by</p>
                        <select className="shop__overview__navbar__sort--select">
                            <option>Featured</option>
                            <option>Best selling</option>
                            <option>Price, low to high</option>
                            <option>Price, high to low</option>
                            <option>Alphabetically, A - Z</option>
                            <option>Alphabetically, Z - A</option>
                            <option>Date, new to old</option>
                            <option>Price, old to new</option>
                        </select>
                    </div>
                </div>
                <div className="shop__overview__container">
                    {products.map((value, index) => (
                        <div className="shop__overview__container__card" key={index}>
                            <Link to={`/product/${value.categoryTag.replaceAll(" ", "-").toLowerCase()}/${value.title.replaceAll(" ", "-").toLowerCase()}`} className="shop__overview__container__card__info">
                                <img className="shop__overview__container__card__info--pic" src={`https://${process.env.REACT_APP_API_URL}:3002/images/${value.img}`} alt="Product pic"/>
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
                                    <div className="button int" onClick={() => dispatch(addToCart({...value, qt: 1}))}>Add to cart</div>
                                </div>
                            </Link>
                            <div className="button ext" onClick={() => dispatch(addToCart({...value, qt: 1}))}>Add to cart</div>
                        </div>
                    ))}
                </div>
                <div className="shop__overview__pagination">
                    {(Number(page) <= 1) ?
                        <div className="disabled">
                            <i className="fas fa-chevron-left"></i>
                        </div> : 
                        <Link to={`/?page=${Number(page)-1}`} onClick={() => this.forceUpdate()} className="button">
                            <i className="fas fa-chevron-left"></i>
                        </Link>
                    }
                    <div className="button">{page}</div>
                    {(products.length < 6) ?
                        <div className="disabled">
                            <i className="fas fa-chevron-right"></i>
                        </div> : 
                        <Link to={`/?page=${Number(page)+1}`} onClick={() => this.forceUpdate()} className="button">
                            <i className="fas fa-chevron-right"></i>
                        </Link>
                    }
                </div>
            </div>
        </div>
    );
}