import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {InputGroup, FormControl, Toast, ToastContainer} from "react-bootstrap"
import {Editor} from '@tinymce/tinymce-react';

const baseURLGet = "http://atlaspood.ir/api/SewingModel/GetAll?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLPost = "http://atlaspood.ir/api/SewingModel/Edit";

function Models() {
    
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    
    const [model, setModel] = React.useState([]);
    // const [photo, setPhoto] = React.useState([]);
    // const [photoUrl, setPhotoUrl] = React.useState([]);
    // const [fabricPhotoUrl, setFabricPhotoUrl] = React.useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [showToast, setShowToast] = React.useState(false);
    
    
    function convertToPersian(string_farsi) {
        let tempString = string_farsi.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace('ك', 'ک');
        return tempString;
    }
    
    function getModel() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            setModel(arr);
        }).catch(err => {
            console.log(err);
        });
        
    }
    
    function renderModel() {
        const modelLists = [];
        for (let i = 0; i < model.length; i++) {
            let SewingModelId = model[i].SewingModelId;
            let ModelName = model[i].ModelName;
            let ModelENName = model[i].ModelENName;
            let DiscountDescription = model[i].DiscountDescription;
            let DiscountEnDescription = model[i].DiscountEnDescription;
            let Description = model[i].Description;
            let ENDescription = model[i].ENDescription;
            let StartPrice = model[i].StartPrice;
            let DiscountPrice = model[i].DiscountPrice;
            let PhotoUrl = model[i].ImageUrl;
            let DefaultFabricPhotoUrl = model[i].DefaultFabricImageUrl;
            
            // let tempPhotoUrl = [...photoUrl];
            // tempPhotoUrl[i] = PhotoUrl;
            // setPhotoUrl(tempPhotoUrl);
            //
            // let tempFabricPhotoUrl = [...fabricPhotoUrl];
            // tempFabricPhotoUrl[i] = DefaultFabricPhotoUrl;
            // setFabricPhotoUrl(tempFabricPhotoUrl);
            
            modelLists.push(
                <li key={"model" + i} model_id={i}>
                    <div className="models_small_inputs">
                        {/*<label className="input">*/}
                        {/*    <input type="text" model_text_id="SewingModelId" model_id={i} defaultValue={SewingModelId} onChange={e => textChanged(e)}*/}
                        {/*           placeholder="Type Something..." readOnly/>*/}
                        {/*    <span className="input__label">Model ID</span>*/}
                        {/*</label>*/}
                        <label className="input">
                            <input type="text" model_text_id="ModelName" model_id={i} defaultValue={ModelName} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">Model FA Name</span>
                        </label>
                        <label className="input">
                            <input type="text" model_text_id="ModelENName" model_id={i} defaultValue={ModelENName} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">Model EN Name</span>
                        </label>
                        <label className="input">
                            <input type="text" className="dir_rtl" model_text_id="DiscountDescription" model_id={i} defaultValue={DiscountDescription} onChange={e => textChanged(e)} placeholder="شروع به نوشتن کنید..."/>
                            <span className="input__label">Desc Above Price FA</span>
                        </label>
                        <label className="input">
                            <input type="text" model_text_id="DiscountEnDescription" model_id={i} defaultValue={DiscountEnDescription} onChange={e => textChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">Desc Above Price EN</span>
                        </label>
                    </div>
                    <div className="models_small_inputs">
                        <label className="input">
                            <input type="text" model_text_id="StartPrice" model_id={i} defaultValue={StartPrice} onChange={e => numberChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">Price</span>
                        </label>
                        
                        <label className="input">
                            <input type="text" model_text_id="DiscountPrice" model_id={i} defaultValue={DiscountPrice} onChange={e => numberChanged(e)} placeholder="Type Something..."/>
                            <span className="input__label">Discount Price</span>
                        </label>
                        <div>
                            <label className="input_file_label">Main Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                model_text_id="PhotoFile"
                                model_id={i}
                                multiple={false}
                                onChange={e => updatePicture(e)}
                            />
                        </div>
                        <div>
                            <label className="input_file_label">Fabric Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                model_text_id="DefaultFabricPhotoFile"
                                model_id={i}
                                multiple={false}
                                onChange={e => updatePicture(e)}
                            />
                        </div>
                    
                    </div>
                    <div className="models_large_inputs">
                        <label className="input editor_container">
                            <Editor
                                apiKey="3uw03r5df0osn2rjhclnqcli0o4aehyx3sbmipq9aege3f81"
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={Description}
                                onEditorChange={(newText) => textEditorChanged(newText, i, "Description")}
                                init={{
                                    height: 215,
                                    menubar: false,
                                    plugins: [
                                        'lists',
                                        'insertdatetime paste wordcount'
                                    ],
                                    toolbar: 'formatselect | ' +
                                        'bold italic | bullist | numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family: iransans, sans-serif; font-size:14px; direction:rtl; } p{margin-block-end: 0;}'
                                }}
                            
                            />
                            <span className="input__label">FA Description</span>
                        </label>
                    </div>
                    <div className="models_large_inputs">
                        <label className="input editor_container">
                            <Editor
                                apiKey="3uw03r5df0osn2rjhclnqcli0o4aehyx3sbmipq9aege3f81"
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={ENDescription}
                                onEditorChange={(newText) => textEditorChanged(newText, i, "ENDescription")}
                                init={{
                                    height: 215,
                                    menubar: false,
                                    plugins: [
                                        'lists',
                                        'insertdatetime paste wordcount'
                                    ],
                                    toolbar: 'formatselect | ' +
                                        'bold italic | bullist | numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family: proximanova-nova, sans-serif; font-size:14px; } p{margin-block-end: 0;}'
                                }}
                            
                            /> <span className="input__label">EN Description</span>
                        </label>
                    </div>
                    <div className="models_small_inputs">
                        
                        <button className="btn btn-success mt-4 mb-2" model_id={i}
                                onClick={e => updateModel(e)}
                        >Update Model
                        </button>
                    </div>
                </li>
            );
        }
        setModelList(modelLists);
    }
    
    function updatePicture(e) {
        let file = e.target.files[0];
        const tempModel = [...model];
        tempModel[e.target.getAttribute('model_id')][e.target.getAttribute('model_text_id')] = file;
        setModel(tempModel);
    }
    
    function updateModel(e) {
        const tempModel = [...model];
        let postModelsArray = tempModel[e.target.getAttribute('model_id')];
        const formData = new FormData();
        formData.append("ApiKey", window.$apikey);
        formData.append("SewingModelId", postModelsArray['SewingModelId']);
        formData.append("ModelName", postModelsArray['ModelName']);
        formData.append("ModelENName", postModelsArray['ModelENName']);
        formData.append("Description", postModelsArray['Description']);
        formData.append("ENDescription", postModelsArray['ENDescription']);
        formData.append("DiscountDescription", postModelsArray['DiscountDescription']);
        formData.append("DiscountEnDescription", postModelsArray['DiscountEnDescription']);
        
        if (postModelsArray['StartPrice'] === null || postModelsArray['StartPrice'] === undefined || postModelsArray['StartPrice'] === "" ) {
            formData.append("StartPrice", 0);
        }
        else{
            formData.append("StartPrice", postModelsArray['StartPrice']);
        }
        if (postModelsArray['DiscountPrice'] === null || postModelsArray['DiscountPrice'] === undefined || postModelsArray['DiscountPrice'] === "" ) {
            formData.append("DiscountPrice", 0);
        }
        else{
            formData.append("DiscountPrice", postModelsArray['DiscountPrice']);
        }
        if (postModelsArray['PhotoFile'] === null || postModelsArray['PhotoFile'] === undefined) {
            formData.append("PhotoUrl", postModelsArray['PhotoUrl']);
            formData.append("PhotoFile", null);
        }
        else {
            formData.append("PhotoFile", postModelsArray['PhotoFile']);
            formData.append("PhotoUrl", null);
        }
        if (postModelsArray['DefaultFabricPhotoFile'] === null || postModelsArray['DefaultFabricPhotoFile'] === undefined) {
            formData.append("DefaultFabricPhotoUrl", postModelsArray['DefaultFabricPhotoUrl']);
            formData.append("DefaultFabricPhotoFile", null);
        }
        else {
            formData.append("DefaultFabricPhotoFile", postModelsArray['DefaultFabricPhotoFile']);
            formData.append("DefaultFabricPhotoUrl", null);
        }
        console.log(model[e.target.getAttribute('model_id')]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post(baseURLPost, formData, config)
            .then(() => {
                setShowToast(true);
            }).catch(err => {
            console.log(err);
        });
        
    }
    
    function textEditorChanged(tempText, i, model_text_id) {
        const tempModel = [...model];
        tempModel[i][model_text_id] = convertToPersian(tempText);
        setModel(tempModel);
        // console.log(model)
    }
    
    
    function textChanged(e) {
        const tempModel = [...model];
        tempModel[e.target.getAttribute('model_id')][e.target.getAttribute('model_text_id')] = e.target.value;
        setModel(tempModel);
        // console.log(model)
    }
    
    function numberChanged(e) {
        const tempModel = [...model];
        tempModel[e.target.getAttribute('model_id')][e.target.getAttribute('model_text_id')] = parseInt(e.target.value);
        setModel(tempModel);
    }
    
    
    useEffect(() => {
        getModel();
        
    }, []);
    
    useEffect(() => {
        if (model.length) {
            renderModel()
        }
    }, [model]);
    
    return (
        <div className="models_page_container">
            <h1 className="models_title">Models List</h1>
            <div className="models">
                <ul className="models_list">
                    {modelList}
                </ul>
            </div>
            
            <ToastContainer className="p-3 position_fixed" position="top-start">
                <Toast onClose={() => setShowToast(false)} bg="success" show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <img
                            src={"holder.js/20x20?text=%20"}
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Success</strong>
                        {/*<small>couple of seconds ago</small>*/}
                    </Toast.Header>
                    <Toast.Body>Saved Successfully!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>);
}

export default Models;