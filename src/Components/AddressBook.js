import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Toast, ToastContainer} from "react-bootstrap";
import Select from "react-dropdown-select";
import CustomDropdownWithSearch from "./CustomDropdownWithSearch";
import CustomControl from "./CustomControl";
import SelectOptionRange from "./SelectOptionRange";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useDispatch} from "react-redux";
import GetPrice from "./GetPrice";
import NumberToPersianWord from "number_to_persian_word";
import {removeNodeAtPath} from "@nosferatu500/react-sortable-tree";
import {func, object} from "prop-types";


const baseURLGetAddress = "https://api.atlaspood.ir/user/GetAddress";
const baseURLAddAddress = "https://api.atlaspood.ir/user/AddAddress";
const baseURLDeleteAddress = "https://api.atlaspood.ir/user/DeleteAddress";
const baseURLEditAddress = "https://api.atlaspood.ir/user/EditAddress";
const baseURLGetStates = "https://api.atlaspood.ir/City/GetStates";
const baseURLGetCities = "https://api.atlaspood.ir/City/GetCities/";


function AddressBook() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [address1, setAddress1] = useState({
        id: "",
        Name: "",
        Last: "",
        Address1: "",
        Address2: "",
        State: "1",
        City: "1",
        ZipCode: "",
        PhoneNumber: ""
    });
    const [address2, setAddress2] = useState({
        id: "",
        Name: "",
        Last: "",
        Address1: "",
        Address2: "",
        State: "1",
        City: "1",
        ZipCode: "",
        PhoneNumber: "",
        IsDefault: false,
        index: -1,
        edit: false,
        StateId: -1,
        CityId: -1,
        fields: false
    });
    const [addAddress, setAddAddress] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState(false);
    const [defaultAddressEdit, setDefaultAddressEdit] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [modals, setModals] = useState([]);
    const [userAddress, setUserAddress] = useState([]);
    const [userAddressRender, setUserAddressRender] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    let navigate = useNavigate();
    
    const [edit, setEdit] = useState(false);
    const [editElement, setEditElement] = useState({
        label:"",
        value:undefined
    });
    
    const [firstNotExist, setFirstNotExist] = useState(false);
    const [lastNotExist, setLastNotExist] = useState(false);
    const [address1NotExist, setAddress1NotExist] = useState(false);
    const [zipCodeNotExist, setZipCodeNotExist] = useState(false);
    const [mobileNotExist, setMobileNotExist] = useState(false);
    const [firstNotExistEdit, setFirstNotExistEdit] = useState(false);
    const [lastNotExistEdit, setLastNotExistEdit] = useState(false);
    const [address1NotExistEdit, setAddress1NotExistEdit] = useState(false);
    const [zipCodeNotExistEdit, setZipCodeNotExistEdit] = useState(false);
    const [mobileNotExistEdit, setMobileNotExistEdit] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [citiesEdit, setCitiesEdit] = useState([]);
    const [selectedState, setSelectedState] = useState([]);
    const [selectedEditState, setSelectedEditState] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [selectedEditCity, setSelectedEditCity] = useState([]);
    const [selectedEditCityId, setSelectedEditCityId] = useState([]);
    const [tempCity, setTempCity] = useState([]);
    const [tempCityId, setTempCityId] = useState(undefined);
    
    
    const [mobileErrorState, setMobileErrorState] = useState(0);
    
    const mobileError = {
        "en": [
            {error: "Please enter a valid mobile."},
            {error: "Please enter a valid mobile."}
        ],
        "fa": [
            {error: "لطفا شماره موبایل معتبری وارد کنید."},
            {error: "لطفا شماره موبایل معتبری وارد کنید."}
        ],
        
    };
    
    function validateNumber(user_number) {
        if (user_number.length !== 11) {
            // setMobileNotExist(true);
            setMobileErrorState(0);
        } else if (!/^0[0-9].*$/.test(user_number)) {
            // setMobileNotExist(true);
            setMobileErrorState(1);
        } else {
            setMobileNotExist(false);
        }
    }
    
    function setAddress(num, refIndex, value) {
        // console.log(num, refIndex, value);
        if (num === 1) {
            let temp = JSON.parse(JSON.stringify(address1));
            temp[refIndex] = value;
            setAddress1(temp);
        } else if (num === 2) {
            let temp = JSON.parse(JSON.stringify(address2));
            temp[refIndex] = value;
            temp["fields"] = true;
            setAddress2(temp);
        }
    }
    
    function modalHandleShow(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = true;
        setModals(tempModals);
    }
    
    function modalHandleClose(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = false;
        setModals(tempModals);
        setDeleteIndex(null);
    }
    
    function getUserAddress() {
        axios.get(baseURLGetAddress, {
            headers: authHeader()
        }).then((response) => {
            setUserAddress(response.data);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        getUserAddress();
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    // useEffect(() => {
    //     if (address2.index !== -1 && address2.edit) {
    //         setTempCityId(address2["CityId"]);
    //         setAddress(2, "edit", false);
    //     }
    //     if (address2["fields"]) {
    //         let temp2 = JSON.parse(JSON.stringify(address2));
    //         temp2["fields"] = false;
    //         setAddress2(temp2);
    //         renderUserAddress(temp2.index);
    //     }
    // }, [address2]);
    
    // useEffect(() => {
    //     if (tempCityId) {
    //         setSelectedEditState(states.find(opt => opt.value === address2["StateId"]) ? [states.find(opt => opt.value === address2["StateId"])] : []);
    //         if (states.find(opt => opt.value === address2["StateId"])) {
    //             getCities(pageLanguage, address2["StateId"], true);
    //         } else {
    //             setSelectedEditCity([]);
    //             setCitiesEdit([]);
    //         }
    //     }
    // }, [tempCityId]);
    
    // useEffect(() => {
    //     if (citiesEdit.length > 0) {
    //         renderUserAddress(address2.index);
    //     }
    // }, [citiesEdit]);
    
    // useEffect(() => {
    //     if (selectedEditCityId.length > 0) {
    //         setAddress(2, "CityId", selectedEditCityId[0].value);
    //         setSelectedEditCity([...selectedEditCityId]);
    //     } else {
    //         // setAddress(2, "CityId", -1);
    //         setSelectedEditCity([]);
    //     }
    // }, [selectedEditCityId]);
    
    useEffect(() => {
        if (edit) {
            editUserAddress();
        }
    }, [edit]);
    
    useEffect(() => {
        if (editElement.label!=="") {
            let temp = JSON.parse(JSON.stringify(address2));
            temp[editElement.label] = editElement.value;
    
            if(editElement.label==="StateId"){
                temp["CityId"] = -1;
                renderUserAddress(temp["id"],temp);
            }
            
            setAddress2(temp);
            setEditElement({label:"",value:undefined});
        }
    }, [editElement]);
    
    function handleSubmit(e,citiesEdit) {
        e.preventDefault();
        console.log(e.target.City.value,citiesEdit);
        
        let temp = JSON.parse(JSON.stringify(address2));
        if (e.target.NameEdit.value === "") {
            setFirstNotExistEdit(true);
        }
        if (e.target.LastEdit.value === "") {
            setLastNotExistEdit(true);
        }
        if (e.target.Address1Edit.value === "") {
            setAddress1NotExistEdit(true);
        }
        if (e.target.ZipCodeEdit.value === "") {
            setZipCodeNotExistEdit(true);
        }
        if (e.target.PhoneNumberEdit.value === "") {
            setMobileNotExistEdit(true);
        }
        temp["id"] = e.target.refIndex.value;
        temp["Name"] = e.target.NameEdit.value;
        temp["Last"] = e.target.LastEdit.value;
        temp["Address1"] = e.target.Address1Edit.value;
        temp["Address2"] = e.target.Address2Edit.value;
        temp["ZipCode"] = e.target.ZipCodeEdit.value;
        temp["PhoneNumber"] = e.target.PhoneNumberEdit.value;
        temp["IsDefault"] = e.target.IsDefault.checked;
        temp["edit"] = true;
        temp["StateId"] = states.find(opt => opt.label === e.target.State.value).value;
        temp["CityId"] = citiesEdit.find(opt => opt.label === e.target.City.value).value;
        setAddress2(temp);
        
        
        if (temp["Name"] !== "" && temp["Last"] !== "" && temp["Address1"] !== "" && temp["ZipCode"] !== "" && temp["PhoneNumber"] !== "") {
            setEdit(true);
        } else {
        }
        
    }
    
    function renderUserAddress(refIndex,addressArr) {
        let tempAddressArr = [];
        let tempObj=addressArr?addressArr:{};
        
        let promiseArr = [];
        for (let i = 0; i < userAddress.length; i++) {
            promiseArr[i] = new Promise(function (resolve, reject) {
                let temp = Object.keys(tempObj).length>0?addressArr:JSON.parse(JSON.stringify(address2));
                let selectedState = [];
                let editStates = [];
                let selectedCity = [];
                let editCities = [];
                let promise3 = new Promise((resolve, reject) => {
                    if (refIndex === userAddress[i]["CustomerAddressId"]) {
                        if(temp["id"]==="") {
                            temp["id"] = userAddress[i]["CustomerAddressId"];
                            temp["Name"] = userAddress[i]["FirstName"];
                            temp["Last"] = userAddress[i]["LastName"];
                            temp["Address1"] = userAddress[i]["Address"];
                            temp["Address2"] = userAddress[i]["Address2"];
                            temp["ZipCode"] = userAddress[i]["ZipCode"];
                            temp["PhoneNumber"] = userAddress[i]["Mobile"];
                            temp["IsDefault"] = userAddress[i]["IsDefault"];
                            temp["index"] = i;
                            temp["edit"] = true;
                            temp["StateId"] = userAddress[i]["StateId"];
                            temp["CityId"] = userAddress[i]["CityId"];
                            setAddress2(temp);
                        }
                        
                        axios.get(baseURLGetStates).then((response) => {
                            let arrayObj = response.data.map(item => {
                                return {
                                    value: item["CityId"],
                                    label: pageLanguage === "fa" ? item["CityName"] : item["CityEnName"]
                                };
                            });
                            selectedState = [arrayObj.find(opt => opt.value === temp["StateId"])];
                            editStates = arrayObj;
                            if(selectedState[0]===undefined){
                                selectedState=[];
                                editCities=[];
                                selectedCity=[];
                                setCitiesEdit([]);
                                resolve();
                            }
                            else if (selectedState.length > 0) {
                                axios.get(baseURLGetCities + temp["StateId"])
                                    .then((response) => {
                                        let arrayObj2 = response.data.map(item => {
                                            return {
                                                value: item["CityId"],
                                                label: pageLanguage === "fa" ? item["CityName"] : item["CityEnName"]
                                            };
                                        });
                                        selectedCity = [arrayObj2.find(opt => opt.value === temp["CityId"])];
                                        editCities = arrayObj2;
                                        setCitiesEdit(arrayObj2);
    
                                        if(selectedCity[0]===undefined){
                                            selectedCity=[];
                                            setCitiesEdit([]);
                                            resolve();
                                        }
                                        else if (selectedState.length > 0) {
                                            resolve();
                                        } else {
                                            resolve();
                                        }
                                    }).catch(err => {
                                    reject();
                                });
                            } else {
                                resolve();
                            }
                        }).catch(err => {
                            reject();
                        });
                        
                    } else {
                        resolve();
                    }
                });
                
                promise3.then(() => {
                    // console.log(selectedState,selectedCity,editStates,editCities);
                    tempAddressArr[i] =
                        <li className="address_list_item" key={i}>
                            <h1 className="address_list_item_title">{userAddress[i]["IsDefault"] ? t("(Default Address)") : ""}</h1>
                            <h3 className="address_list_item_details">{userAddress[i]["FirstName"]} {userAddress[i]["LastName"]}</h3>
                            <h3 className="address_list_item_details">{userAddress[i]["Address"]} {userAddress[i]["Address2"]}</h3>
                            <h3 className="address_list_item_details">{pageLanguage === "fa" ? userAddress[i]["CityName"] : userAddress[i]["CityEnName"]} {pageLanguage === "fa" ? userAddress[i]["StateName"] : userAddress[i]["StateEnName"]}</h3>
                            {/*<h3 className="address_list_item_details">{userAddress[i]["country"] ? userAddress[i]["country"] : "Iran"}</h3>*/}
                            <h3 className="address_list_item_details">{userAddress[i]["ZipCode"] ? userAddress[i]["ZipCode"] : ""}</h3>
                            <div className="address_list_item_buttons">
                                <button className="address_list_item_button1 btn btn-new-dark" onClick={() => {
                                    renderUserAddress(userAddress[i]["CustomerAddressId"]);
                                }}>{t("EDIT")}</button>
                                <button className="address_list_item_button2 btn" onClick={() => {
                                    modalHandleShow("deleteAddress");
                                    setDeleteIndex(i);
                                }}>{t("DELETE")}</button>
                            </div>
                            {refIndex === userAddress[i]["CustomerAddressId"] &&
                            
                            <form onSubmit={(e)=>handleSubmit(e,editCities,temp["CityId"])}>
                                <div className="address_edit_section">
                                    <div className="checkout_left_info_flex">
                                        <input name="refIndex" hidden={true} value={userAddress[i]["CustomerAddressId"]}/>
                                        <div className="checkout_left_info_flex_left">
                                            <input type="text" placeholder={t("First Name*")} className="form-control" name="NameEdit" defaultValue={temp["Name"]}
                                            onChange={(e)=>setEditElement({label:"Name",value:e.target.value})}/>
                                            {firstNotExistEdit && <div className="input_not_valid">{t("First Name Required.")}</div>}
                                        </div>
                                        <div className="checkout_left_info_flex_right">
                                            <input type="text" placeholder={t("Last Name*")} className="form-control" name="LastEdit" defaultValue={temp["Last"]}
                                                   onChange={(e)=>setEditElement({label:"Last",value:e.target.value})}/>
                                            {lastNotExistEdit && <div className="input_not_valid">{t("Last Name Required.")}</div>}
                                        </div>
                                    </div>
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_left">
                                            <div className="select_container">
                                                <Select
                                                    className="select"
                                                    name="State"
                                                    placeholder={t("State*")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    values={selectedState}
                                                    // onDropdownOpen={() => {
                                                    //     let temp1 = window.scrollY;
                                                    //     window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                    //     setTimeout(() => {
                                                    //         let temp2 = window.scrollY;
                                                    //         if (temp2 === temp1)
                                                    //             window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                    //     }, 100);
                                                    // }}
                                                    dropdownRenderer={
                                                        ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                    }
                                                    onChange={(selected) => {
                                                        if (selected.length) {
                                                            setEditElement({label:"StateId",value:selected[0].value});
                                                        }
                                                    }}
                                                    options={editStates}
                                                />
                                            </div>
                                        </div>
                                        <div className="checkout_left_info_flex_right">
                                            <div className="select_container">
                                                <Select
                                                    className="select"
                                                    name="City"
                                                    placeholder={t("City*")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    values={selectedCity}
                                                    // onDropdownOpen={() => {
                                                    //     let temp1 = window.scrollY;
                                                    //     window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                                    //     setTimeout(() => {
                                                    //         let temp2 = window.scrollY;
                                                    //         if (temp2 === temp1)
                                                    //             window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                                    //     }, 100);
                                                    // }}
                                                    dropdownRenderer={
                                                        ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                                    }
                                                    onChange={(selected) => {
                                                        if (selected.length) {
                                                            setSelectedEditCityId(selected);
                                                            setEditElement({label:"CityId",value:selected[0].value})
                                                            // setAddress(2, "CityId", selected[0].value);
                                                        } else {
                                                            // setAddress(2, "CityId", -1);
                                                        }
                                                    }}
                                                    options={editCities}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_all">
                                            <input type="text" placeholder={t("Address 1*")} className="form-control" name="Address1Edit" defaultValue={temp["Address1"]}
                                                   onChange={(e)=>setEditElement({label:"Address1",value:e.target.value})}/>
                                            {address1NotExistEdit && <div className="input_not_valid">{t("Address1 Required.")}</div>}
                                        </div>
                                    </div>
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_all">
                                            <input type="text" placeholder={t("Address 2")} className="form-control" name="Address2Edit" defaultValue={temp["Address2"]}
                                                   onChange={(e)=>setEditElement({label:"Address2",value:e.target.value})}/>
                                        </div>
                                    </div>
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_left">
                                            <input type="text" placeholder={t("Zip Code*")} className="form-control" name="ZipCodeEdit" defaultValue={temp["ZipCode"]}
                                                   onChange={(e)=>setEditElement({label:"ZipCode",value:e.target.value})}/>
                                            {zipCodeNotExistEdit && <div className="input_not_valid">{t("ZipCode Required.")}</div>}
                                        </div>
                                        <div className="checkout_left_info_flex_right">
                                            <input type="text" placeholder={t("Mobile*")} className="form-control" name="PhoneNumberEdit" defaultValue={temp["PhoneNumber"]}
                                                   onChange={(e)=>setEditElement({label:"PhoneNumber",value:e.target.value})}/>
                                            {mobileNotExistEdit && <div className="input_not_valid">{mobileError[pageLanguage][mobileErrorState]["error"]}</div>}
                                        </div>
                                    </div>
                                    <div className="checkout_left_info_shipping_agree">
                                        <div className="checkout_left_info_flex">
                                            <div className="checkout_left_info_flex_checkbox">
                                                <label className="account_label">
                                                    <input type="checkbox" defaultChecked={temp["IsDefault"]} name="IsDefault" id="IsDefault"
                                                           onChange={(e)=>setEditElement({label:"IsDefault",value:e.target.checked})}/>
                                                    <label htmlFor="IsDefault" className="checkbox_label">
                                                        <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                             alt=""/>
                                                    </label>{t("Set as default address")}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="add_new_address_confirm btn btn-new-dark" type="submit">{t("UPDATE ADDRESS")}</button>
                                </div>
                            </form>
                            }
                        </li>
                    ;
                    // if (i === userAddress.length - 1) {
                    resolve();
                    // }
                }).catch(()=>{
                    resolve();
                })
            });
        }
        Promise.all(promiseArr).then(() => {
            setUserAddressRender(tempAddressArr);
        });
    }
    
    function validateInputs() {
        let temp = JSON.parse(JSON.stringify(address1));
        if (temp["Name"] === "") {
            setFirstNotExist(true);
        }
        if (temp["Last"] === "") {
            setLastNotExist(true);
        }
        if (temp["Address1"] === "") {
            setAddress1NotExist(true);
        }
        if (temp["ZipCode"] === "") {
            setZipCodeNotExist(true);
        }
        if (temp["PhoneNumber"] === "") {
            setMobileNotExist(true);
        }
        
        if (temp["Name"] !== "" && temp["Last"] !== "" && temp["Address1"] !== "" && temp["ZipCode"] !== "" && temp["PhoneNumber"] !== "") {
            return true;
        } else {
            return false;
        }
        
    }
    
    function addUserAddress() {
        let tempObj = {};
        tempObj["firstName"] = address1.Name;
        tempObj["lastName"] = address1.Last;
        tempObj["cityId"] = selectedCity.length > 0 ? selectedCity[0].value : "1";
        tempObj["address"] = address1.Address1;
        tempObj["address2"] = address1.Address2;
        tempObj["StateId"] = selectedState.length > 0 ? selectedState[0].value : "1";
        tempObj["zipCode"] = address1.ZipCode;
        tempObj["tel"] = address1.PhoneNumber;
        tempObj["mobile"] = address1.PhoneNumber;
        tempObj["IsDefault"] = defaultAddress;
        // console.log(address1);
        axios.post(baseURLAddAddress, tempObj, {
            headers: authHeader()
        })
            .then((response) => {
                getUserAddress();
                clearAddressFields();
            })
            .catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            addUserAddress();
                        } else {
                            navigate("/" + pageLanguage);
                        }
                    });
                } else {
                    clearAddressFields();
                    getUserAddress();
                }
            });
    }
    
    function deleteUserAddress(refIndex) {
        axios.delete(baseURLDeleteAddress, {
            params: {
                id: userAddress[refIndex]["CustomerAddressId"]
            },
            headers: authHeader()
        }).then((response) => {
            getUserAddress();
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        deleteUserAddress(refIndex);
                    } else {
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    function editUserAddress() {
        let tempObj = {};
        setEdit(false);
        tempObj["CustomerAddressId"] = address2.id;
        tempObj["firstName"] = address2.Name;
        tempObj["lastName"] = address2.Last;
        tempObj["cityId"] = address2["CityId"];
        tempObj["address"] = address2.Address1;
        tempObj["address2"] = address2.Address2;
        tempObj["StateId"] = address2["StateId"];
        tempObj["zipCode"] = address2.ZipCode;
        tempObj["tel"] = address2.PhoneNumber;
        tempObj["mobile"] = address2.PhoneNumber;
        tempObj["IsDefault"] = address2["IsDefault"];
        axios.post(baseURLEditAddress, tempObj, {
            headers: authHeader()
        })
            .then((response) => {
                getUserAddress();
                clearAddressFields();
            })
            .catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            editUserAddress();
                        } else {
                            navigate("/" + pageLanguage);
                        }
                    });
                } else {
                    clearAddressFields();
                    getUserAddress();
                }
            });
        let temp = JSON.parse(JSON.stringify(address1));
        temp["id"] = "";
        temp["Name"] = "";
        temp["Last"] = "";
        temp["Address1"] = "";
        temp["Address2"] = "";
        temp["ZipCode"] = "";
        temp["PhoneNumber"] = "";
        setAddress1(temp);
        setAddAddress(false);
    }
    
    function getCities(pageLang, stateId, edit) {
        if (stateId === undefined) {
            axios.get(baseURLGetStates)
                .then((response) => {
                    let arrayObj = response.data.map(item => {
                        return {
                            value: item["CityId"],
                            label: pageLang === "fa" ? item["CityName"] : item["CityEnName"]
                        };
                    });
                    if (selectedState.length) {
                        setTempCity(selectedCity);
                        setSelectedState([arrayObj.find(opt => opt.value === selectedState[0].value)]);
                    }
                    // console.log(arrayObj);
                    setStates(arrayObj);
                }).catch(err => {
                console.log(err);
            });
        } else {
            axios.get(baseURLGetCities + stateId)
                .then((response) => {
                    let arrayObj = response.data.map(item => {
                        return {
                            value: item["CityId"],
                            label: pageLang === "fa" ? item["CityName"] : item["CityEnName"]
                        };
                    });
                    if (tempCityId) {
                        let tempValue = JSON.parse(JSON.stringify(tempCityId));
                        setTempCity([]);
                        setTempCityId(undefined);
                        // setSelectedEditCity(arrayObj.find(opt => opt.value === tempValue) ? [arrayObj.find(opt => opt.value === tempValue)] : []);
                    } else if (tempCity.length) {
                        let tempValue = tempCity[0].value;
                        setTempCity([]);
                        setTimeout(() => {
                            if (edit) {
                                // setSelectedEditCityId([arrayObj.find(opt => opt.value === tempValue)]);
                            } else {
                                setSelectedCity([arrayObj.find(opt => opt.value === tempValue)]);
                            }
                        }, 500);
                    } else {
                        if (edit) {
                            // setSelectedEditCityId([]);
                        } else {
                            setSelectedCity([]);
                            setAddress(1, "City", "");
                        }
                    }
                    // console.log(arrayObj);
                    if (edit) {
                        // setCitiesEdit(arrayObj);
                    } else {
                        setCities(arrayObj);
                    }
                }).catch(err => {
                console.log(err);
            });
        }
    }
    
    function clearAddressFields() {
        setAddress1({
            id: "",
            Name: "",
            Last: "",
            Address1: "",
            Address2: "",
            State: "1",
            City: "1",
            ZipCode: "",
            PhoneNumber: ""
        });
        setAddress2({
            id: "",
            Name: "",
            Last: "",
            Address1: "",
            Address2: "",
            State: "1",
            City: "1",
            ZipCode: "",
            PhoneNumber: "",
            IsDefault: false,
            index: -1,
            edit: false,
            StateId: -1,
            CityId: -1,
            fields: false
        });
        setSelectedCity([]);
        setSelectedState([]);
        setAddAddress(false);
    }
    
    useEffect(() => {
        if (userAddress.length) {
            renderUserAddress();
            setHasAddress(true);
        } else {
            // setHasAddress(false);
        }
    }, [userAddress]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        getUserAddress();
        getCities(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    return (
        <div className={`Account_AddressBook_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="Account_settings_section">
                <h1 className="Account_settings_section_title">{t("ADDRESS BOOK")}</h1>
                {!hasAddress &&
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">{t("no_address")}</span>
                    <span className="Account_settings_item_right"/>
                </div>
                }
                {hasAddress &&
                <div className="Account_settings_item">
                    <ul className="address_list">
                        {userAddressRender}
                    </ul>
                </div>
                }
                <div className="Account_settings_item">
                    <span className="Account_settings_item_left">
                        <button className="add_new_address btn btn-new-dark" onClick={() => {
                            setAddAddress(!addAddress);
                            let temp = JSON.parse(JSON.stringify(address1));
                            temp["id"] = "";
                            temp["Name"] = "";
                            temp["Last"] = "";
                            temp["Address1"] = "";
                            temp["Address2"] = "";
                            temp["ZipCode"] = "";
                            temp["PhoneNumber"] = "";
                            setAddress1(temp);
                        }}>{t("ADD A NEW ADDRESS")}</button>
                    </span>
                    <span className="Account_settings_item_right"/>
                </div>
                {addAddress &&
                <div className="Account_AddressBook_new_address">
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_left">
                            <input type="text" placeholder={t("First Name*")} className="form-control" name="Name1" value={address1["Name"]}
                                   onChange={(e) => {
                                       setAddress(1, "Name", e.target.value);
                                   }}/>
                            {firstNotExist && <div className="input_not_valid">{t("First Name Required.")}</div>}
                        </div>
                        <div className="checkout_left_info_flex_right">
                            <input type="text" placeholder={t("Last Name*")} className="form-control" name="Last1" value={address1["Last"]}
                                   onChange={(e) => {
                                       setAddress(1, "Last", e.target.value);
                                   }}/>
                            {lastNotExist && <div className="input_not_valid">{t("Last Name Required.")}</div>}
                        </div>
                    </div>
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_left">
                            <div className="select_container">
                                <Select
                                    className="select"
                                    placeholder={t("State*")}
                                    portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
                                    values={selectedState}
                                    // onDropdownOpen={() => {
                                    //     let temp1 = window.scrollY;
                                    //     window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                    //     setTimeout(() => {
                                    //         let temp2 = window.scrollY;
                                    //         if (temp2 === temp1)
                                    //             window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                    //     }, 100);
                                    // }}
                                    dropdownRenderer={
                                        ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                    }
                                    contentRenderer={
                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                    }
                                    onChange={(selected) => {
                                        if (selected.length) {
                                            setSelectedState(selected);
                                            getCities(pageLanguage, selected[0].value);
                                        }
                                    }}
                                    options={states}
                                />
                            </div>
                        </div>
                        <div className="checkout_left_info_flex_right">
                            <div className="select_container">
                                <Select
                                    className="select"
                                    placeholder={t("City*")}
                                    portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
                                    values={selectedCity}
                                    // onDropdownOpen={() => {
                                    //     let temp1 = window.scrollY;
                                    //     window.scrollTo(window.scrollX, window.scrollY + 0.5);
                                    //     setTimeout(() => {
                                    //         let temp2 = window.scrollY;
                                    //         if (temp2 === temp1)
                                    //             window.scrollTo(window.scrollX, window.scrollY - 0.5);
                                    //     }, 100);
                                    // }}
                                    dropdownRenderer={
                                        ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                    }
                                    contentRenderer={
                                        ({props, state, methods}) => <CustomControl props={props} state={state} methods={methods}/>
                                    }
                                    onChange={(selected) => {
                                        if (selected.length) {
                                            setSelectedCity(selected);
                                        }
                                    }}
                                    options={cities}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_all">
                            <input type="text" placeholder={t("Address 1*")} className="form-control" name="Address11" value={address1["Address1"]}
                                   onChange={(e) => {
                                       setAddress(1, "Address1", e.target.value);
                                   }}/>
                            {address1NotExist && <div className="input_not_valid">{t("Address1 Required.")}</div>}
                        </div>
                    </div>
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_all">
                            <input type="text" placeholder={t("Address 2")} className="form-control" name="Address21" value={address1["Address2"]}
                                   onChange={(e) => {
                                       setAddress(1, "Address2", e.target.value);
                                   }}/>
                        </div>
                    </div>
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_left">
                            <input type="text" placeholder={t("Zip Code*")} className="form-control" name="ZipCode1" value={address1["ZipCode"]}
                                   onChange={(e) => {
                                       setAddress(1, "ZipCode", e.target.value);
                                   }}/>
                            {zipCodeNotExist && <div className="input_not_valid">{t("ZipCode Required.")}</div>}
                        </div>
                        <div className="checkout_left_info_flex_right">
                            <input type="text" placeholder={t("Mobile*")} className="form-control" name="PhoneNumber1" value={address1["PhoneNumber"]}
                                   onChange={(e) => {
                                       setAddress(1, "PhoneNumber", e.target.value.replace(/\D/g, '').replace(/[^0-9]/g, ""));
                                       validateNumber(e.target.value);
                                   }}/>
                            {mobileNotExist && <div className="input_not_valid">{mobileError[pageLanguage][mobileErrorState]["error"]}</div>}
                        </div>
                    </div>
                    <div className="checkout_left_info_shipping_agree">
                        <div className="checkout_left_info_flex">
                            <div className="checkout_left_info_flex_checkbox">
                                <label className="account_label">
                                    <input type="checkbox" checked={defaultAddress} onChange={(e) => {
                                        setDefaultAddress(e.target.checked);
                                    }} id="defaultAddress"/>
                                    <label htmlFor="defaultAddress" className="checkbox_label">
                                        <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                                    </label>{t("Set as default address")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_all">
                            <button className="add_new_address_confirm btn btn-new-dark" onClick={() => {
                                if (validateInputs())
                                    addUserAddress();
                            }}>{t("ADD ADDRESS")}</button>
                        </div>
                    </div>
                </div>
                }
            </div>
            
            <Modal dialogClassName={`deleteAddress_modal mediumSizeModal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={modals["deleteAddress"] === undefined ? false : modals["deleteAddress"]}
                   onHide={() => modalHandleClose(" deleteAddress")}>
                <Modal.Header closeButton>
                    {/*<Modal.Title>Modal heading</Modal.Title>*/}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("delete_address_question")}</p>
                    
                    <br/>
                    <div className="buttons_section">
                        <button className="btn btn-danger" onClick={() => {
                            deleteUserAddress(deleteIndex);
                            modalHandleClose("deleteAddress");
                        }}>{t("YES")}</button>
                        <button className="btn btn-new-dark" onClick={() => modalHandleClose("deleteAddress")}>{t("CANCEL")}</button>
                    </div>
                </Modal.Body>
                {/*<Modal.Footer>*/}
                {/*    */}
                {/*</Modal.Footer>*/}
            </Modal>
        </div>
    
    );
}

export default AddressBook;