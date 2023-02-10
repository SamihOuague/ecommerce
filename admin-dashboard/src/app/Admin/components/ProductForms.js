import React, { useState } from "react";
import { convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { PKCEComponent, SubmitComponent } from "../../PKCE/PKCEComponents";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const ProductForm = ({ setShowForm, categoryList }) => {
    const [editorState, setEditorState] = useState();
    const [ dataForm, setDataForm ] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { title, weight, price, categoryTag, img, aroma, nonce, token } = e.target;
        const reader = new FileReader();
        reader.readAsDataURL(img.files[0]);
        reader.onload = () => {
            const data = {
                title: title.value,
                weight: weight.value,
                price: price.value,
                categoryTag: categoryTag.value,
                img: reader.result,
                description: (editorState) ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : "",
                aroma: aroma.value,
                nonce: nonce.value,
                token: token.value,
            };
            fetch("http://localhost:3002/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Barear ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({img: data.img}),
            }).then(async (res) => {
                try {
                    let r = await res.json();
                    if (!r.message) return ;
                    setDataForm({...data, img: r.message});
                } catch {
                    console.log("Upload image failed.");
                }
            });
        }
    }

    return (
        <form className="admin__container__products__form" onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Title" name="title" required/>
            <input type="text" placeholder="Aroma *" name="aroma"/>
            <input type="number" placeholder="Weight (Gr.)" name="weight" required/>
            <input type="number" placeholder="Price ($)" name="price" step="0.05" required/>
            <select name="categoryTag">
                <option>--- Choose Category ---</option>
                {categoryList.map((value, index) => (
                    <optgroup key={index} label={value.category}>
                        {value.subcategory.map((v, i) => (
                            <option value={v.name} key={i}>{v.name}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <input type="file" name="img"/>
            <Editor editorState={editorState}
                onEditorStateChange={(e) => setEditorState(e)}
                editorStyle={{ height: "200px", border: "2px solid black" }} />
            <PKCEComponent />
            <div className="btn-group">
                <SubmitComponent path={"http://localhost:3003/"} dataForm={dataForm} btnValue={"Add"} redirectTo={"/redirect?url=/"}/>
                <button className="button btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
        </form>
    );
}