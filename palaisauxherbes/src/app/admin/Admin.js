import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMainThunk, addCategoryThunk, addSubCategoryThunk, addProductThunk, deleteCategoryThunk, deleteSubCategoryThunk, deleteProductThunk } from "./adminSlice";
import { convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { Navigate } from "react-router-dom";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const Admin = () => {
    const { categories, products } = useSelector((state) => state.admin);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [ editorState, setEditorState ] = useState(null);

    const handleCat = (e) => {
        let v = e.target.category.value;
        if (v !== '')
            dispatch(addCategoryThunk({name: v}));
        e.target.category.value = "";
        e.preventDefault();
    };

    const handleSubCat = (e, url) => {
        let v = e.target.subcategory.value;
        if (v !== '')
            dispatch(addSubCategoryThunk({body: {name: v}, url}));
        e.target.subcategory.value = "";
        e.preventDefault();
    };
    
    const handleProduct = (e) => {
        let { title, weight, price, categorytag } = e.target;
        let reader = new FileReader();
        reader.readAsDataURL(e.target.img.files[0]);
        reader.onload = () => {
            dispatch(addProductThunk({
                title: title.value,
                weight: weight.value,
                price: price.value,
                categoryTag: categorytag.value,
                img: reader.result,
                description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            }));
            title.value = weight.value = price.value = "";
        }
        e.preventDefault();
    }

    const onEditorState = (es) => {
        setEditorState(es);
    }

    useEffect(() => {
        dispatch(getMainThunk());
    }, [dispatch]);

    if (!token) return <Navigate to={"/login"}/>
    if (categories === null || products === null) {
        return (<p>Loading...</p>);
    } else {
        return (
            <div className="admin">
                <div className="admin__container">
                    <h2>Add Product</h2>
                    <form onSubmit={(e) => handleProduct(e)}>
                        <input type="text" placeholder="Product title" name="title"/>
                        <input type="number" placeholder="Product weight" name="weight"/>
                        <input type="number" placeholder="Product price" name="price" step={0.01}/>
                        <input type="file" name="img"/>
                        <select name="categorytag">
                            <option>--Choose category--</option>
                            {categories.map((value, index) => (
                                <optgroup key={index} label={value.category}>
                                    {value.subcategory.map((v, i) => (
                                        <option value={v.name} key={i}>{v.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div style={{border: "2px solid black"}}>
                            <Editor editorState={editorState} onEditorStateChange={onEditorState}/>
                        </div>
                        <input type="submit" value="Add"/>
                    </form>
                    <div className="admin__container__products">
                        <ul>
                            {products.map((value, index) => (
                                <li key={index}>{value.title} - ({value.categoryTag}) - <button onClick={() => dispatch(deleteProductThunk(value.title))}>delete</button></li>
                            ))}
                        </ul>
                    </div>
                    <h2>Add Category</h2>
                    <form onSubmit={(e) => handleCat(e)}>
                        <input type="text" name="category" placeholder="Category name" />
                        <input type="submit" value="Add"/>
                    </form>
                    <div className="admin__container__categories">
                        {categories.map((value, index) => (
                            <div key={index} className="admin__container__categories__elt">
                                <h3>{value.category} - <button onClick={() => dispatch(deleteCategoryThunk(value.category))}>delete</button></h3>
                                <ul>
                                    {value.subcategory.map((v, i) => (
                                        <li key={i}>{v.name} - <button onClick={() => dispatch(deleteSubCategoryThunk({category: value.category, name: v.name}))}>delete</button></li>
                                    ))}
                                </ul>
                                <form onSubmit={(e) => handleSubCat(e, value.category)}>
                                    <input type="text" name="subcategory" placeholder="Sub-category name" />
                                    <input type="submit" value="Add"/>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="admin__container">
                        <h2>Orders List</h2>
                </div>
            </div>
        );
    }
}