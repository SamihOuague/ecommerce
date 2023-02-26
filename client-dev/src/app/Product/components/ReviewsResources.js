import React, { useEffect, useState } from "react";
import { Resources, Spinner } from "../../Resources/Resources";
import { useNavigate } from "react-router-dom";

export const ReviewsResource = ({ id }) => {
    return <Resources path={`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_REVIEWS}/${id}`} render={(data) => {
        if (data.loading) return <Spinner />
        else if (!data.payload || data.errorCode) {
            return (
                <div className="product">
                    <h2>ERROR - 500</h2>
                </div>
            );
        }
        return <ReviewsComponent payload={data.payload} id={id}/>;
    }} />
}


const ReviewsComponent = ({ payload, id }) => {
    const [ reviews, setReviews ] = useState(payload);

    useEffect(() => {
        setReviews(payload);
    }, [payload]);

    return (
        <div className="product__infos__body">
            <h5 className="product__infos__body--title">Avis</h5>
            <ReviewsForm id={id} setReviews={setReviews} reviews={reviews}/>
            <div className="product__infos__body__reviews">
                {(reviews.length === 0) ?
                    <p>Pas d'avis pour le moment.</p> :
                    reviews.map((value, key) => (
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
                    ))}
            </div>
        </div>
    );
}



const ReviewsForm = ({id, setReviews, reviews}) => {
    const [voteRate, setVoteRate] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const postReview = async (e) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            if (e.target.comment.value && id && voteRate) {
                let response = await (await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_REVIEWS}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Barear ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        comment: e.target.comment.value,
                        product_id: id,
                        rate: voteRate,
                    }),
                })).json();
                if (response._id) setReviews([...reviews, response]);
                else if (response.success === false) navigate("/auth");
            }
            setVoteRate(0);
            setLoading(false);
        }
        e.target.comment.value = "";
    }
    return (
        <form className="product__infos__body__create-review" onSubmit={(e) => postReview(e)}>
            <textarea placeholder="Write your comment here" name="comment" disabled={loading}></textarea>
            <button className="product__infos__body__create-review__review-rate" disabled={loading}>
                {[1, 2, 3, 4, 5].map((v, k) => (
                    <i className={`${(v <= voteRate) ? 'fa-solid' : 'fa-regular'} fa-star`}
                        onMouseEnter={() => (!loading) && setVoteRate(v)}
                        onMouseLeave={() => (!loading) && setVoteRate(0)}
                        key={k}></i>
                ))}
            </button>
        </form>
    );
};