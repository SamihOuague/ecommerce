import React, { useState } from "react";
import { convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const CategoryComponent = ({ categoryList }) => {
    const [categories, setCategories] = useState(categoryList);

    const handleSubCat = (e, url) => {
        let v = e.target.subcategory.value;
        if (!v || !url) return;
        fetch(`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/category/${url.replaceAll(' ', '-')}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name: v }),
        }).then(async (res) => {
            const r = await res.json();
            if (r && r.subcategory) {
                setCategories((() => {
                    let cpCategories = [...categories];
                    let cpCat = cpCategories.find((v) => v._id === r._id);
                    cpCat.subcategory = r.subcategory;
                    return cpCategories;
                })());
            }
            e.target.subcategory.value = "";
        });
        e.preventDefault();
    };

    const handleCat = (e) => {
        let v = e.target.category.value;
        if (v !== '') {
            fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Barear ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name: v }),
            }).then(async (res) => {
                const r = await res.json();
                if (r && r._id) setCategories([...categories, r]);
            });
        }
        e.target.category.value = "";
        e.preventDefault();
    };

    const handleDeleteCat = (name) => {
        if (!name) return;
        fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/category", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name }),
        }).then(async (res) => {
            const r = await res.json();
            if (r && r._id) setCategories(categories.filter((v) => v._id !== r._id));
        });
    }

    const handleDeleteSubCat = (name, url) => {
        if (!name) return;
        fetch(`https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/category/${url.replaceAll(' ', '-')}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name }),
        }).then(async (res) => {
            const r = await res.json();
            if (r && r._id) {
                setCategories((() => {
                    let cpCategories = [...categories];
                    let cpCat = cpCategories.find((v) => v._id === r._id);
                    cpCat.subcategory = r.subcategory;
                    return cpCategories;
                })());
            };
        });
    }
    return (
        <div className="admin__container">
            <h2>Add Category</h2>
            <form onSubmit={(e) => handleCat(e)}>
                <input type="text" name="category" placeholder="Category name" style={{ minHeight: "31px" }} />
                <button type="submit" className="button">Add</button>
            </form>
            <div className="admin__container__categories">
                {categories.map((value, index) => (
                    <div key={index} className="admin__container__categories__elt">
                        <h3>{value.category} - <button className="btn-danger button" onClick={() => handleDeleteCat(value.category)}>delete</button></h3>
                        <ul>
                            {value.subcategory.map((v, i) => (
                                <li key={i}>{v.name} - <button className="btn-danger button" onClick={() => handleDeleteSubCat(v.name, value.category)}>delete</button></li>
                            ))}
                        </ul>
                        <form onSubmit={(e) => handleSubCat(e, value.category)}>
                            <input type="text" name="subcategory" placeholder="Sub-category name" style={{ minHeight: "31px" }} />
                            <button type="submit" className="button">Add</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductComponent({ productList, categoryList }) {
    const [editorState, setEditorState] = useState(null);
    const [products, setProducts] = useState(productList);

    const handleProduct = (e) => {
        let { title, weight, price, categorytag, aroma } = e.target;
        let reader = new FileReader();
        reader.readAsDataURL(e.target.img.files[0]);
        reader.onload = () => {
            const data = {
                title: title.value,
                weight: weight.value,
                price: price.value,
                categoryTag: categorytag.value,
                img: reader.result,
                description: (editorState) ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : "",
                aroma: aroma.value,
            };
            fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/img/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Barear ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ img: data.img }),
            }).then(async (response) => {
                let imgRes = await response.json();
                if (!imgRes || !imgRes.message) return;
                data.img = imgRes.message;
                await fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Barear ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(data),
                }).then(async (res) => {
                    let r = await res.json();
                    if (r._id) setProducts([...products, { ...r }]);
                });
                title.value = weight.value = price.value = aroma.value = "";
            });
        }
        e.preventDefault();
    }



    const onEditorState = (es) => {
        setEditorState(es);
    }

    const handleDeleteProduct = (name) => {
        fetch("https://orgde0n2gg.execute-api.eu-west-3.amazonaws.com/api/product/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name }),
        }).then(async (res) => {
            let r = await res.json();
            if (r._id) setProducts(products.filter((v) => v._id !== r._id));
        })
    }

    return (
        <div className="admin__container">
            <h2>Add Product</h2>
            <form onSubmit={(e) => handleProduct(e)}>
                <input type="text" placeholder="Product title" name="title" />
                <input type="number" placeholder="Product weight" name="weight" />
                <input type="text" placeholder="Product aroma*" name="aroma" />
                <input type="number" placeholder="Product price" name="price" step={0.01} />
                <input type="file" name="img" />
                <select name="categorytag">
                    <option>--Choose category--</option>
                    {categoryList.map((value, index) => (
                        <optgroup key={index} label={value.category}>
                            {value.subcategory.map((v, i) => (
                                <option value={v.name} key={i}>{v.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <div style={{ border: "2px solid black" }}>
                    <Editor editorState={editorState} onEditorStateChange={onEditorState} editorStyle={{ minHeight: "300px" }} />
                </div>
                <button className="button" type="submit">Add</button>
            </form>
            <div className="admin__container__products">
                <ul>
                    {products.map((value, index) => (
                        <li key={index}>
                            {value.title} - ({value.categoryTag}) -
                            <button className="button btn-danger" onClick={() => handleDeleteProduct(value.title)}>delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <CategoryComponent categoryList={categoryList} />
        </div>
    );
}

export default ProductComponent;