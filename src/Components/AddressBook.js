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
import {func} from "prop-types";


const baseURLGetAddress = "http://api.atlaspood.ir/user/GetAddress";
const baseURLAddAddress = "http://api.atlaspood.ir/user/AddAddress";
const baseURLDeleteAddress = "http://api.atlaspood.ir/user/DeleteAddress";
const baseURLEditAddress = "http://api.atlaspood.ir/user/EditAddress";


function AddressBook() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [address1, setAddress1] = useState({
        id:"",
        Name: "",
        Last: "",
        Address1: "",
        Address2: "",
        State: "1",
        City: "1",
        ZipCode: "",
        PhoneNumber: ""
    });
    const [addAddress, setAddAddress] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [modals, setModals] = useState([]);
    const [userAddress, setUserAddress] = useState([]);
    const [userAddressRender, setUserAddressRender] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [firstNotExist, setFirstNotExist] = useState(false);
    const [lastNotExist, setLastNotExist] = useState(false);
    const [address1NotExist, setAddress1NotExist] = useState(false);
    const [zipCodeNotExist, setZipCodeNotExist] = useState(false);
    const [phoneNotExist, setPhoneNotExist] = useState(false);
    
    function setAddress(num, refIndex, value) {
        if (num === 1) {
            let temp = JSON.parse(JSON.stringify(address1));
            temp[refIndex] = value;
            setAddress1(temp);
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
        axios.post(baseURLGetAddress, {}, {
            headers: authHeader()
        }).then((response) => {
            setUserAddress(response.data);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        localStorage.setItem('user', JSON.stringify(response2.data));
                        dispatch({
                            type: LOGIN,
                            payload: {user: response2.data},
                        });
                        getUserAddress();
                    } else {
                        if (localStorage.getItem("user") !== null) {
                            localStorage.removeItem("user");
                        }
                        dispatch({
                            type: LOGOUT,
                        });
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    function renderUserAddress() {
        let tempAddressArr = [];
        
        let promise2 = new Promise((resolve, reject) => {
            for (let i = 0; i < userAddress.length; i++) {
                tempAddressArr[i] =
                    <li className="address_list_item" key={i}>
                        <h1 className="address_list_item_title">{userAddress[i]["default"] ?t("(Default Address)"):""}</h1>
                        <h3 className="address_list_item_details">{userAddress[i]["FirstName"]} {userAddress[i]["LastName"]}</h3>
                        <h3 className="address_list_item_details">{userAddress[i]["Address"]} {userAddress[i]["Address2"]}</h3>
                        <h3 className="address_list_item_details">{userAddress[i]["City"]} {userAddress[i]["Region"]}</h3>
                        <h3 className="address_list_item_details">{userAddress[i]["country"]?userAddress[i]["country"]:"Iran"}</h3>
                        <div className="address_list_item_buttons">
                            <button className="address_list_item_button1 btn btn-new-dark" onClick={()=>{
                                let temp = JSON.parse(JSON.stringify(address1));
                                temp["id"] = userAddress[i]["CustomerAddressId"];
                                temp["Name"] = userAddress[i]["FirstName"];
                                temp["Last"] = userAddress[i]["LastName"];
                                temp["Address1"] = userAddress[i]["Address"];
                                temp["Address2"] = userAddress[i]["Address2"];
                                temp["ZipCode"] = userAddress[i]["ZipCode"];
                                temp["PhoneNumber"] = userAddress[i]["Mobile"];
                                setAddress1(temp);
                                setIsEdit(true);
                                setAddAddress(true);
                            }}>{t("EDIT")}</button>
                            <button className="address_list_item_button2 btn" onClick={() => {
                                modalHandleShow("deleteAddress");
                                setDeleteIndex(i);
                            }}>{t("DELETE")}</button>
                        </div>
                    </li>;
                if (i === userAddress.length - 1) {
                    resolve();
                }
            }
        });
        promise2.then(() => {
            setUserAddressRender(tempAddressArr);
        });
    }
    
    function validateInputs() {
        let temp = JSON.parse(JSON.stringify(address1));
        if(temp["Name"]===""){
            setFirstNotExist(true);
        }
        if(temp["Last"]===""){
            setLastNotExist(true);
        }
        if(temp["Address1"]===""){
            setAddress1NotExist(true);
        }
        if(temp["ZipCode"]===""){
            setZipCodeNotExist(true);
        }
        if(temp["PhoneNumber"]===""){
            setPhoneNotExist(true);
        }
        
        if(temp["Name"]!=="" &&temp["Last"]!=="" &&temp["Address1"]!=="" &&temp["ZipCode"]!=="" &&temp["PhoneNumber"]!==""){
            return true;
        }
        else{
            return false;
        }
    }
    
    function addUserAddress() {
        let tempObj = {};
        tempObj["firstName"] = address1.Name;
        tempObj["lastName"] = address1.Last;
        tempObj["cityId"] = address1.City;
        tempObj["address"] = address1.Address1;
        tempObj["address2"] = address1.Address2;
        tempObj["zoneNo"] = address1.State;
        tempObj["zipCode"] = address1.ZipCode;
        tempObj["tel"] = address1.PhoneNumber;
        tempObj["mobile"] = address1.PhoneNumber;
        axios.post(baseURLAddAddress, tempObj, {
            headers: authHeader()
        })
            .then((response) => {
                getUserAddress();
            })
            .catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            localStorage.setItem('user', JSON.stringify(response2.data));
                            dispatch({
                                type: LOGIN,
                                payload: {user: response2.data},
                            });
                            addUserAddress();
                        } else {
                            if (localStorage.getItem("user") !== null) {
                                localStorage.removeItem("user");
                            }
                            dispatch({
                                type: LOGOUT,
                            });
                            navigate("/" + pageLanguage);
                        }
                    });
                }
                getUserAddress();
            });
    }
    
    function deleteUserAddress(refIndex) {
        axios.delete(baseURLDeleteAddress, {
            params: {
                id: userAddress[refIndex]["CustomerAddressId"]
            },
            headers:authHeader()
        }).then((response) => {
            getUserAddress();
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        localStorage.setItem('user', JSON.stringify(response2.data));
                        dispatch({
                            type: LOGIN,
                            payload: {user: response2.data},
                        });
                        deleteUserAddress(refIndex);
                    } else {
                        if (localStorage.getItem("user") !== null) {
                            localStorage.removeItem("user");
                        }
                        dispatch({
                            type: LOGOUT,
                        });
                        navigate("/" + pageLanguage);
                    }
                });
            }
        });
    }
    
    function editUserAddress(){
        let tempObj = {};
        tempObj["CustomerAddressId"] = address1.id;
        tempObj["firstName"] = address1.Name;
        tempObj["lastName"] = address1.Last;
        tempObj["cityId"] = address1.City;
        tempObj["address"] = address1.Address1;
        tempObj["address2"] = address1.Address2;
        tempObj["zoneNo"] = address1.State;
        tempObj["zipCode"] = address1.ZipCode;
        tempObj["tel"] = address1.PhoneNumber;
        tempObj["mobile"] = address1.PhoneNumber;
        axios.post(baseURLEditAddress, tempObj, {
            headers: authHeader()
        })
            .then((response) => {
                getUserAddress();
            })
            .catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            localStorage.setItem('user', JSON.stringify(response2.data));
                            dispatch({
                                type: LOGIN,
                                payload: {user: response2.data},
                            });
                            editUserAddress();
                        } else {
                            if (localStorage.getItem("user") !== null) {
                                localStorage.removeItem("user");
                            }
                            dispatch({
                                type: LOGOUT,
                            });
                            navigate("/" + pageLanguage);
                        }
                    });
                }
                getUserAddress();
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
        setIsEdit(false);
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
                            setIsEdit(false);
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
                            <div className="select_container">
                                <Select
                                    className="select"
                                    placeholder={t("State*")}
                                    portal={document.body}
                                    dropdownPosition="bottom"
                                    dropdownHandle={false}
                                    dropdownGap={0}
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
                                    
                                    }}
                                    options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
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
                                    }}
                                    options={SelectOptionRange(30, 400, 1, "cm", "", pageLanguage)}
                                />
                            </div>
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
                            <input type="text" placeholder={t("Mobile Number*")} className="form-control" name="PhoneNumber1" value={address1["PhoneNumber"]}
                                   onChange={(e) => {
                                       setAddress(1, "PhoneNumber", e.target.value);
                                   }}/>
                            {phoneNotExist && <div className="input_not_valid">{t("Mobile Number Required.")}</div>}
                        </div>
                    </div>
                    <div className="checkout_left_info_shipping_agree">
                        <div className="checkout_left_info_flex">
                            <div className="checkout_left_info_flex_checkbox">
                                <label className="account_label">
                                    <input type="checkbox" checked={defaultAddress} onChange={(e) => {
                                        setDefaultAddress(e.target.checked);
                                    }}/>{t("Set as default address")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="checkout_left_info_flex">
                        <div className="checkout_left_info_flex_all">
                            {!isEdit &&
                            <button className="add_new_address_confirm btn btn-new-dark" onClick={() => {
                                if(validateInputs())
                                    addUserAddress();
                            }}>{t("ADD ADDRESS")}</button>
                            }
                            {isEdit &&
                            <button className="add_new_address_confirm btn btn-new-dark" onClick={() => {
                                if(validateInputs())
                                    editUserAddress();
                            }}>{t("UPDATE ADDRESS")}</button>
                            }
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