import React, { useState } from "react";
import { PKCEComponent, SubmitComponent } from "../../PKCE/PKCEComponents"

const DeletePop = ({ setPopup, popup }) => {
    const [ dataForm, setDataForm ] = useState();
    const handleDeleteCategory = (e) => {
        e.preventDefault();
        const { token, nonce, name } = e.target;
        const data = {
            token: token.value,
            nonce: nonce.value,
            name: name.value,
        }
        if (data.name) setDataForm(data);
    }

    return (
        <div className="popup">
            <form className="popup__container" onSubmit={(e) => handleDeleteCategory(e)}>
                <h2 className="popup__container--title">Supprimer <span onClick={() => setPopup(false)}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>Cette action est irreversible, voulez vous continuer ?</p>
                <input type="text" defaultValue={popup} name="name" disabled/>
                <PKCEComponent />
                <SubmitComponent
                    btnValue={"Supprimer"}
                    path={`${process.env.REACT_APP_API_URL}:3003/category`}
                    method="DELETE"
                    dataForm={dataForm}
                    redirectTo={"/redirect?url=/"}
                />
                <button className="button btn-danger" onClick={() => setPopup(false)}>Annuler</button>
            </form>
        </div>
    );
}

export const DeleteSubPop = ({ setPopup, popup }) => {
    const [ dataForm, setDataForm ] = useState();
    const handleDeleteCategory = (e) => {
        e.preventDefault();
        const { token, nonce, name } = e.target;
        const data = {
            token: token.value,
            nonce: nonce.value,
            name: name.value,
        }
        if (data.name) setDataForm(data);
    }

    return (
        <div className="popup">
            <form className="popup__container" onSubmit={(e) => handleDeleteCategory(e)}>
                <h2 className="popup__container--title">Supprimer <span onClick={() => setPopup(false)}><i className="fa-regular fa-circle-xmark"></i></span></h2>
                <p>Cette action est irreversible, voulez vous continuer ?</p>
                <input type="text" defaultValue={popup.name} name="name" disabled/>
                <PKCEComponent />
                <SubmitComponent
                    btnValue={"Supprimer"}
                    path={`${process.env.REACT_APP_API_URL}:3003/category/${popup.category}`}
                    method="DELETE"
                    dataForm={dataForm}
                    redirectTo={"/redirect?url=/"}
                />
                <button className="button btn-danger" onClick={() => setPopup(false)}>Annuler</button>
            </form>
        </div>
    );
}

export const SubCategoryForm = ({ category }) => {
    const [ popup, setPopup ] = useState(null);
    const [ formData, setFormData ] = useState();
    const [ showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nonce, token, name } = e.target;
        const data = {
            nonce: nonce.value,
            token: token.value,
            name: name.value,
        }
        setFormData(data);
    }

    if (showForm) {
        return (
            <form className="admin__container__categories__category__subcategory__form" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder="Category name" name="name" required />
                <PKCEComponent/>
                <div className="btn-group">
                    <SubmitComponent path={`http://localhost:3003/category/${category.category}`} btnValue={"Add"} dataForm={formData} redirectTo={"/redirect?url=/"}/>
                    <button className="button btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            </form>
        );
    }
    return (
        <div className="btn-group">
            <button className="button" onClick={() => setShowForm(true)}>Add</button>
            <button className="button btn-danger" onClick={() => setPopup(category.category)}>Delete</button>
            {(popup) && <DeletePop setPopup={setPopup} popup={popup}/>}
        </div>
    );
}

export const CategoryForm = () => {
    const [ showForm, setShowForm ] = useState(false);
    const [ formData, setFormData ] = useState();  

    const handleSubmit = (e) => {
        e.preventDefault()
        let { name, nonce, token } = e.target;
        const data = {
            name: name.value,
            nonce: nonce.value,
            token: token.value,
        }
        setFormData(data);
        name.value = "";
        //setShowForm(false);
    }

    if (showForm) {
        return (
            <form className="admin__container__category-form" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder="Category name" name="name" required />
                <PKCEComponent/>
                <div className="btn-group">
                    <SubmitComponent path={"http://localhost:3003/category"} btnValue={"Add"} dataForm={formData} redirectTo={"/redirect?url=/"}/>
                    <button className="button btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            </form>
        );
    }
    return (
        <div className="admin__container__category-form">
            <button className="button" onClick={() => setShowForm(true)}>New Category</button>
        </div>
    );
}
