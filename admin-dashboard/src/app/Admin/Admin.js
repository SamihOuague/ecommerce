import React from "react";
import Category from "./components/Category";
import Product from "./components/Product";
import { Resources, Spinner } from "../Resources/Resources";

function Admin() {
    return (
            <Resources path={`${process.env.REACT_APP_API_URL}:3003/`} render={(data) => {
                if (data.loading) return <Spinner />;
                else if (!data.payload || data.errCode) {
                    return (
                        <p>ERROR - 500</p>
                    );
                }
                return (
                    <div className="admin">
                        <Category categories={data.payload.cat}/>
                        <Product products={data.payload.prods} categories={data.payload.cat}/>
                    </div>
                );
            }} />
    );
}

export default Admin;