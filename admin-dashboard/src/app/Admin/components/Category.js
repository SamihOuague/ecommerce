import React, { useState } from "react";
import { CategoryForm, SubCategoryForm, DeleteSubPop } from "./CategoryForms";

function CategoryComponent({ categories }) {
    const [showCat, setShowCat] = useState(null);
    const [popup, setPopup] = useState(null);

    const CategoryElement = ({ category }) => {
        return (
            <div className="admin__container__categories__category__elt">
                <span className="admin__container__categories__category__elt--name">{category.category}</span>
                <span className="admin__container__categories__category__elt--down"
                    onClick={() => (category.category === showCat) ? setShowCat(null) : setShowCat(category.category)}>
                    {(category.category !== showCat) ?
                        <i className="fa-solid fa-chevron-down"></i> :
                        <i className="fa-solid fa-chevron-up"></i>
                    }
                </span>
            </div>
        );
    }

    return (
        <div className="admin__container">
            <CategoryForm />
            <div className="admin__container__categories">
                {categories.map((value, key) => (
                    <div className="admin__container__categories__category" key={key}>
                        <CategoryElement category={value} />
                        <ul className={`admin__container__categories__category__subcategory ${(value.category === showCat) ? 'show' : 'hide'}`}>
                            {value.subcategory.map((v, k) => (
                                <li key={k}>
                                    <span className="admin__container__categories__category__subcategory--name">{v.name}</span>
                                    <span className="admin__container__categories__category__subcategory--trash"
                                        onClick={() => setPopup({ category: value.category, name: v.name })}>
                                        <i className="fa-solid fa-trash"></i>
                                    </span>
                                </li>
                            ))}
                            <SubCategoryForm category={value} />
                        </ul>
                    </div>
                ))}
            </div>
            {(popup) && <DeleteSubPop popup={popup} setPopup={setPopup} />}
        </div>
    );
}

function Category({ categories }) {
    return (
        <CategoryComponent categories={categories} />
    );
}

export default Category;