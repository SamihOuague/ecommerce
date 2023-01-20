import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getProductThunk, addQt, removeQt, setShowReviews, setScore, postReviewThunk, getReviewsThunk, setBuyNow } from "./productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../cart/cartSlice";

export const Product = () => {
    const { category, name } = useParams();
    const dispatch = useDispatch();
    const { product, qt, showReviews, score, comments, recommended, rates, buyNow } = useSelector((state) => state.product);
    useEffect(() => {
        dispatch(getProductThunk({category, name}));
        dispatch(setShowReviews(false));
    }, [dispatch, category, name]);

    const handlePostReview = (e) => {
        e.preventDefault();
        if (score) {
            let data = {
                comment: e.target.comment.value,
                rate: score,
                product_id: product._id,
            };
            e.target.comment.value = "";
            dispatch(postReviewThunk(data));
        }
    }

    const handleRateChange = (score) => {
        dispatch(setScore(score));
    }
    
    const handleBuyNow = () => {
        dispatch(addToCart({...product, qt}));
        dispatch(setBuyNow(true));
    }

    if (buyNow) { 
        dispatch(setBuyNow(false));
        return <Navigate to={"/order"}/>
    }
    if (!product) return (
        <div className="product">
            <div className="spinner-container">
                <i className="fa-solid fa-spinner"></i>
            </div>
        </div>
    );
    return(
        <div className="product">
            <div className="product__container">
                <div className="product__container__img">
                    <img src={`https://${process.env.REACT_APP_API_URL}:3002/images/${product.img}`} alt="product pic" className="product__container__img--img"/>
                </div>
                <div className="product__container__details">
                    <h3 className="product__container__details--title">{product.title}</h3>
                    <div className="product__container__details__values">
                        <div className="product__container__details__values__labels">
                            <p className="product__container__details__values__labels--text">Price</p>
                            <p className="product__container__details__values__labels--text">Weight</p>
                            {(product.aroma) && <p className="product__container__details__values__labels--text">Aroma</p>}
                            <p className="product__container__details__values__labels--text">Vendor</p>
                            <p className="product__container__details__values__labels--text">Availability</p>
                            <p className="product__container__details__values__labels--text">Quantity</p>
                        </div>
                        <div className="product__container__details__values__val">
                            <p className="product__container__details__values__val--text">{product.price} $</p>
                            <p className="product__container__details__values__val--text"><span>{product.weight}gr.</span></p>
                            {(product.aroma) && <p className="product__container__details__values__val--text"><span>{product.aroma}</span></p>}
                            <p className="product__container__details__values__val--text">{product.categoryTag}</p>
                            <p className="product__container__details__values__val--text green">In Stock!</p>
                            <div className="product__container__details__values__val__btngroup">
                                <div className="button" onClick={() => dispatch(removeQt())}>
                                    <i className="fas fa-minus"></i>
                                </div>
                                <div className="cart__elt__container__product__body__btngroup--qt">{qt}</div>
                                <div className="button" onClick={() => dispatch(addQt())}>
                                    <i className="fas fa-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product__container__details__btngroup">
                        <div className="button" onClick={() => dispatch(addToCart({...product, qt}))}>
                            <span>ADD TO CART</span>
                        </div>
                        <div className="button" onClick={() => handleBuyNow()}>
                            <span>BUY IT NOW</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="product__infos">
                <div className="product__infos__nav">
                    <div className="product__infos__nav__btngroup">
                        <div className={`button ${(!showReviews) && 'active'}`} onClick={() => dispatch(setShowReviews(false))}>
                            <span>PRODUCT DESCRIPTION</span>
                        </div>
                        <div className={`button ${(showReviews) && 'active'}`} onClick={() => dispatch(getReviewsThunk(product._id))}>
                            <span>REVIEWS</span>
                        </div>
                    </div>
                </div>
                {(!showReviews) ? 
                    <div className="product__infos__body">
                        <div dangerouslySetInnerHTML={{__html: (product.describ) ? product.describ : "<p>No description to show.</p>"}}></div>
                    </div> :
                    <div className="product__infos__body">
                        <h5>Product reviews</h5>
                        <form className="product__infos__body__create-review" onSubmit={(e) => handlePostReview(e)}>
                            <textarea placeholder="Write your comment here" name="comment"></textarea>
                            <button className="product__infos__body__create-review__review-rate">
                                {[1, 2, 3, 4, 5].map((v, k) => (
                                    <i className={`${(v <= score) ? 'fa-solid' : 'fa-regular'} fa-star`} 
                                        onMouseEnter={() => handleRateChange(v)} 
                                        onMouseLeave={() => handleRateChange(0)}
                                        key={k}></i>
                                ))}
                            </button>
                        </form>
                        {(comments.length) ?
                            <div className="product__infos__body__reviews">
                                {comments.map((value, key) => (
                                    <div className="product__infos__body__reviews__review" key={key}>
                                        <div className="product__infos__body__reviews__review__group">
                                            <h5 style={{marginRight: "8px"}}>{value.username}</h5>
                                            <div>
                                                {[1, 2, 3, 4, 5].map((v, k) => (
                                                    <i className={`${(v <= value.rate) ? 'fa-solid' : 'fa-regular'} fa-star`} key={k}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <p>{value.comment}</p>
                                    </div>
                                ))}
                            </div>
                            : <p>No reviews to show.</p>
                        }
                    </div>
                }
            </div>
            <div className="product__recommended">
                <h3 className="product__recommended--title">Recommended Products</h3>
                <div className="product__recommended__container">
                    {recommended.map((value, key) => (
                        <div className="box" key={key}>                            
                            <div className="product__recommended__container__card">
                                <Link to={`/product/${value.categoryTag.replaceAll(" ", "-").toLowerCase()}/${value.title.replaceAll(" ", "-").toLowerCase()}`} className="shop__overview__container__card__info">
                                    <img className="product__recommended__container__card__info--pic" src={`https://${process.env.REACT_APP_API_URL}:3002/images/${value.img}`} alt="Product pic"/>
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
        </div>
    );
};