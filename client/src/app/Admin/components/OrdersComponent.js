import React, { useState } from "react";

function OrdersComponent({ ordersList }) {
    const [ orders ] = useState(ordersList);
    return (
        <div className="admin__container">
            <h2>Orders List</h2>
            <div>
                {(orders && orders.length > 0) && orders.map((value, key) => (
                    <div key={key}>
                        <p>{value.firstname} {value.lastname}</p>
                        <p>{value.address}, {value.zipcode}, {value.city}</p>
                        <p>{value.email} - {value.phoneNumber}</p>
                        <ul>
                            {value.bill.map((v, k) => (
                                <li key={k}>{v.title} - x{v.qt}</li>
                            ))}
                        </ul>
                        <button onClick={() => console.log("Delete Order")}>delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrdersComponent;