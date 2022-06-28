import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
import CartInfo from "../Components/CartInfo";
import NumberToPersianWord from "number_to_persian_word";
import Select from "react-dropdown-select";
import CustomDropdownWithSearch from "../Components/CustomDropdownWithSearch";
import CustomControl from "../Components/CustomControl";
import SelectOptionRange from "../Components/SelectOptionRange";
import {ReactComponent as Logoen} from "../Images/public/logoen.svg";
import {ReactComponent as Logofa} from "../Images/public/logofa.svg";
import GetPrice from "../Components/GetPrice";
import Tooltip from "bootstrap/js/src/tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PopoverStickOnHover from "../Components/PopoverStickOnHover";

const baseURLPrice = "http://api.atlaspood.ir/Sewing/GetSewingOrderPrice";


function Checkout() {
    const {t, i18n} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [cart, setCart] = useState({});
    const [drapery, setDrapery] = useState([]);
    const [draperyList, setDraperyList] = useState([]);
    const [draperyCount, setDraperyCount] = useState(0);
    const [product, setProduct] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [swatches, setSwatches] = useState([]);
    const [swatchesList, setSwatchesList] = useState([]);
    const [swatchesCount, setSwatchesCount] = useState(0);
    const [cartChanged, setCartChanged] = useState(0);
    const [discount, setDiscount] = useState("");
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountAppliedText, setDiscountAppliedText] = useState("");
    
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [passwordsEnable, setPasswordsEnable] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordNotValidState, setPasswordNotValidState] = useState(0);
    const [passwordNotValid, setPasswordNotValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        count:false,
        lowercase:false,
        uppercase:false,
        numbers:false
    });
    
    const [address1, setAddress1] = useState({});
    const [address2Enable, setAddress2Enable] = useState(false);
    const [address2, setAddress2] = useState({});
    const [bank, setBank] = useState(1);
    
    function checkPasswordStrength(user_password) {
        let temp = JSON.parse(JSON.stringify(passwordValidation));
        if (user_password.length > 20) {
            setPasswordNotValidState(0);
        } else if (user_password.length < 8) {
            setPasswordNotValidState(0);
        } else {
            let matchedCase = [];
            matchedCase.push("[A-Z]");      // Uppercase
            matchedCase.push("[a-z]");      // Lowercase
            matchedCase.push("[0-9]");      // Numbers
            let count = 0;
            for (let i = 0; i < matchedCase.length; i++) {
                if (new RegExp(matchedCase[i]).test(user_password)) {
                    count++;
                }
            }
            if (count === 3) {
                setPasswordNotValidState(1);
                setPasswordNotValid(false);
            }
            else{
                setPasswordNotValidState(0);
            }
        }
        
        temp.count = user_password.length <= 20 && user_password.length >= 8;
        
        temp.uppercase = new RegExp("[A-Z]").test(user_password);
        
        temp.lowercase = new RegExp("[a-z]").test(user_password);
        
        temp.numbers = new RegExp("[0-9]").test(user_password);
        
        setPasswordValidation(temp);
        
    }
    
    function setBasketNumber(refIndex, numValue, type, minusPlus) {
        let temp = [];
        let typeString = "";
        let cartObj = {};
        if (type === 0) {
            if (localStorage.getItem("cart") !== null) {
                cartObj = JSON.parse(localStorage.getItem("cart"));
                temp = cartObj["drapery"];
                typeString = "drapery";
            } else {
                setCart({});
            }
        } else if (type === 1) {
            if (localStorage.getItem("cart") !== null) {
                cartObj = JSON.parse(localStorage.getItem("cart"));
                temp = cartObj["product"];
                typeString = "product";
            } else {
                setCart({});
            }
        } else {
            if (localStorage.getItem("cart") !== null) {
                cartObj = JSON.parse(localStorage.getItem("cart"));
                temp = cartObj["swatches"];
                typeString = "swatches";
            } else {
                setCart({});
            }
        }
        if (temp !== []) {
            if (minusPlus !== undefined) {
                if (temp[refIndex] === undefined) {
                    temp[refIndex]["qty"] = 1;
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                } else {
                    if (temp[refIndex]["qty"] + minusPlus <= 0 || temp[refIndex]["qty"] + minusPlus > 10)
                        setBasketNumber(refIndex, temp[refIndex]["qty"] + minusPlus, type);
                    else {
                        temp[refIndex]["qty"] = temp[refIndex]["qty"] + minusPlus;
                        cartObj[typeString] = temp;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        setCartChanged(cartChanged + 1);
                    }
                }
            } else {
                if (numValue > 10) {
                    temp[refIndex]["qty"] = 10;
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                    
                } else if (numValue <= 0) {
                    temp.splice(refIndex, 1);
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                } else {
                    temp[refIndex]["qty"] = numValue;
                    cartObj[typeString] = temp;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    setCartChanged(cartChanged + 1);
                }
            }
        }
    }
    
    function copyItem(index) {
        let tempObj = JSON.parse(JSON.stringify(drapery[index]));
        tempObj["qty"] = 1;
        if (localStorage.getItem("cart") !== null) {
            let cartObj = JSON.parse(localStorage.getItem("cart"));
            if (cartObj["drapery"] === undefined)
                cartObj["drapery"] = [];
            cartObj["drapery"].push(tempObj);
            localStorage.setItem('cart', JSON.stringify(cartObj));
            setCartChanged(cartChanged + 1);
        } else {
            let newCartObj = {};
            let newCartArr = [];
            newCartArr[0] = tempObj;
            newCartObj["drapery"] = newCartArr;
            newCartObj["product"] = [];
            newCartObj["swatches"] = [];
            localStorage.setItem('cart', JSON.stringify(newCartObj));
            setCartChanged(cartChanged + 1);
        }
    }
    
    function checkDiscount() {
        let discountText = discount;
        setDiscountApplied(true);
        setDiscountAppliedText(discountText);
        setDiscount("");
    }
    
    function removeDiscount() {
        setDiscountApplied(false);
        setDiscountAppliedText("");
    }
    
    function setAddress(num, refIndex, value) {
        if (num === 1) {
            let temp = JSON.parse(JSON.stringify(address1));
            temp[refIndex] = value;
            setAddress1(temp);
        } else {
            let temp = JSON.parse(JSON.stringify(address2));
            temp[refIndex] = value;
            setAddress2(temp);
        }
    }
    
    useEffect(() => {
        if (localStorage.getItem("cart") !== null) {
            setCart(JSON.parse(localStorage.getItem("cart")));
        } else {
            setCart({});
        }
    }, [cartChanged, location.pathname]);
    
    useEffect(() => {
        if (cart["drapery"] === undefined || cart["drapery"] === []) {
            setDrapery([]);
            setDraperyCount(0);
        } else {
            setDrapery(cart["drapery"]);
            setDraperyCount(cart["drapery"].length);
        }
        if (cart["product"] === undefined || cart["product"] === []) {
            setProduct([]);
            setProductCount(0);
        } else {
            setProduct(cart["product"]);
            setProductCount(cart["product"].length);
        }
        if (cart["swatches"] === undefined || cart["swatches"] === []) {
            setSwatches([]);
            setSwatchesCount(0);
        } else {
            setSwatches(cart["swatches"]);
            setSwatchesCount(cart["swatches"].length);
        }
    }, [cart]);
    
    useEffect(() => {
        if (drapery.length) {
            let tempDrapery = drapery;
            let cartInfo = JSON.parse(JSON.stringify(CartInfo));
            let temp = [];
            let delArr = [];
            
            let draperiesTotalPrice = 0;
            let promiseArr = [];
            
            tempDrapery.forEach((obj, index) => {
                let tempPostObj = {};
                tempPostObj["ApiKey"] = window.$apikey;
                let cartInfo = JSON.parse(JSON.stringify(CartInfo));
                
                Object.keys(obj).forEach(key => {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj === undefined) {
                        delArr.push(index);
                    } else {
                        if (tempObj["apiLabel"] !== "") {
                            if (tempObj["apiValue"] === null) {
                                tempPostObj[tempObj["apiLabel"]] = obj[key];
                            } else {
                                tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][obj[key]];
                            }
                        }
                    }
                });
                tempPostObj["SewingOrderDetails"] = [];
                tempPostObj["SewingOrderDetails"][0] = {};
                tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
                tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
                tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
                
                Object.keys(obj).forEach(key => {
                    let tempObj = cartInfo.find(obj => obj["cart"] === key);
                    if (tempObj === undefined) {
                        if (delArr.indexOf(index) <= -1)
                            delArr.push(index);
                    } else {
                        if (tempObj["apiLabel2"] !== undefined) {
                            if (tempObj["apiValue2"] === null) {
                                tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = obj[key];
                            } else {
                                tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][obj[key]];
                            }
                        }
                    }
                });
                
                tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                Object.keys(obj).forEach(key => {
                    if (obj[key] !== null || obj[key] !== "") {
                        let tempObj = cartInfo.find(obj => obj["cart"] === key);
                        if (tempObj["apiAcc"] !== undefined) {
                            if (tempObj["apiAcc"] === true) {
                                tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][obj[key]]);
                            } else {
                            
                            }
                        }
                    }
                });
                tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                    return el != null;
                });
                
                if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                    promiseArr[index] = axios.post(baseURLPrice, tempPostObj);
                }
                
            });
            
            delArr.forEach(el => {
                tempDrapery.splice(el, 1);
            });
            
            Promise.all(promiseArr).then(function (values) {
    
                tempDrapery.forEach((obj, index) => {
                    let fabricColorFa = obj["FabricColorFa"];
                    let fabricColor = obj["FabricColorEn"];
                    let fabricDesignFa = obj["FabricDesignFa"];
                    let fabricDesign = obj["FabricDesignEn"];
                    let defaultModelNameFa = obj["ModelNameFa"];
                    let defaultModelName = obj["ModelNameEn"];
                    let roomNameFa = obj["RoomNameFa"];
                    let roomName = obj["RoomNameEn"];
                    let WindowName = obj["WindowName"] === undefined ? "" : obj["WindowName"];
                    let photoUrl = obj["PhotoUrl"];
                    let desc = [];
                    obj["price"] = values[index].data["price"];
                    draperiesTotalPrice += obj["price"];
                    
                    Object.keys(obj).forEach(key => {
                        let tempObj = cartInfo.find(obj => obj["cart"] === key);
                        if (tempObj === undefined) {
                            delArr.push(index);
                        } else {
                            if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                let objLabel = "";
                                if (tempObj["titleValue"] === null) {
                                    if (tempObj["titlePostfix"] === "") {
                                        objLabel = t(obj[key].toString());
                                    } else {
                                        objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj[key]}`).toString() + t(tempObj["titlePostfix"]) : obj[key].toString() + t(tempObj["titlePostfix"]);
                                    }
                                } else {
                                    if (tempObj["titleValue"][obj[key].toString()] === null) {
                                        if (tempObj["titlePostfix"] === "") {
                                            objLabel = t(obj[key].toString());
                                        } else {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj[key]}`).toString() + t(tempObj["titlePostfix"]) : obj[key].toString() + t(tempObj["titlePostfix"]);
                                        }
                                    } else {
                                        objLabel = t(tempObj["titleValue"][obj[key].toString()]);
                                    }
                                }
                                desc[tempObj["order"]] =
                                    <div className="basket_item_title_desc" key={key}>
                                        <h3>{t(tempObj["title"])}&nbsp;</h3>
                                        <h4>{objLabel}</h4>
                                    </div>
                            }
                        }
                    });
                    
                    temp[index]=
                        <li className="checkout_item_container" key={index}>
                            <div className="checkout_item_image_container">
                                <img src={`http://api.atlaspood.ir/${photoUrl}`} alt="" className="checkout_item_img"/>
                                <p className="checkout_item_image_qty">{pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["qty"]}`) : obj["qty"]}</p>
                            </div>
                            <div className="checkout_item_desc_container">
                                <div className="checkout_item">
                                    <h1 className="checkout_item_name">{pageLanguage === 'fa' ? defaultModelNameFa + " سفارشی " : "Custom " + defaultModelName}</h1>
                                    <span
                                        className="checkout_item_price">{GetPrice(obj["price"],pageLanguage,t("TOMANS"))}</span>
                                </div>
                                {<PopoverStickOnHover classNames="basket_view_detail_popover"
                                                      placement="bottom"
                                                      children={<h2 className="checkout_item_details">{t("View Details")}</h2>}
                                                      component={
                                                          <div className="basket_item_title_container">
                                                              {desc}
                                                          </div>
                                                      }/>
                                }
                            </div>
                        </li>;
                });
                setDraperyList(temp);
                if (localStorage.getItem("cart") !== null) {
                    let cartObjects=JSON.parse(localStorage.getItem("cart"));
                    cartObjects["drapery"]=tempDrapery;
                    localStorage.setItem('cart', JSON.stringify(cartObjects));
                } else {
                    setCart({});
                }
                setTotalPrice(draperiesTotalPrice);
            }).catch(err => {
                console.log(err);
            });
            
        }
    }, [drapery]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        let pageLanguage1 = tempLang.slice(1, 3).join('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        i18n.changeLanguage(pageLanguage1);
        document.body.dir = pageLanguage1 === 'fa' ? "rtl" : "ltr";
        document.body.className = pageLanguage1 === 'fa' ? "font_farsi" : "font_en";
    }, [location.pathname]);
    
    return (
        <div className={`basket_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="checkout_container">
                <div className="checkout_left">
                    <div className="Logo"><Link to="/">{pageLanguage === 'en' ? <Logoen/> : <Logofa/>}</Link></div>
                    {/*<div className="breadcrumb_container dir_ltr">*/}
                    {/*    <Breadcrumb className="breadcrumb">*/}
                    {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>*/}
                    {/*        <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"*/}
                    {/*                         linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>Checkout</Breadcrumb.Item>*/}
                    {/*    </Breadcrumb>*/}
                    {/*</div>*/}
                    
                    
                    <div className="checkout_left_container">
                        <div className="checkout_left_info">
                            <div className="checkout_left_info_login_section">
                                <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                    <div className="checkout_left_info_flex_left">
                                        <h1 className="checkout_left_info_title">{t("CONTACT INFORMATION")}</h1>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                        <span className="checkout_left_info_text">{t("Already have an account? ")}<p>{t("Log in")}</p></span>
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_left">
                                        <input type="text" placeholder={t("Email Address*")} className="form-control" name="Email" value={loginInfo.email}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(loginInfo));
                                                   temp.email = e.target.value;
                                                   setLoginInfo(temp);
                                               }}/>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                    </div>
                                </div>
                            </div>
                            
                            <div className="checkout_left_info_shipping_address">
                                <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                    <div className="checkout_left_info_flex_left">
                                        <h1 className="checkout_left_info_title">{t("SHIPPING ADDRESS")}</h1>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_left">
                                        <input type="text" placeholder={t("First Name*")} className="form-control" name="Name1" value={address1["Name"]}
                                               onChange={(e) => {
                                                   setAddress(1, "Name", e.target.value);
                                               }}/>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                        <input type="text" placeholder={t("Last Name*")} className="form-control" name="Last1" value={address1["Last"]}
                                               onChange={(e) => {
                                                   setAddress(1, "Last", e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_all">
                                        <input type="text" placeholder={t("Address 1*")} className="form-control" name="Address11" value={address1["Address1"]}
                                               onChange={(e) => {
                                                   setAddress(1, "Address1", e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_all">
                                        <input type="text" placeholder={t("Address 2*")} className="form-control" name="Address21" value={address1["Address2"]}
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
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                        <input type="text" placeholder={t("Phone Number*")} className="form-control" name="PhoneNumber1" value={address1["PhoneNumber"]}
                                               onChange={(e) => {
                                                   setAddress(1, "PhoneNumber", e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className="checkout_left_info_shipping_agree">
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_checkbox">
                                            <input type="checkbox" checked={passwordsEnable} onChange={(e) => {
                                                setPasswordsEnable(e.target.checked);
                                                setAddress2Enable(false);
                                            }}/>
                                            <p>{t("checkout_confirm")}</p>
                                        </div>
                                    </div>
                                </div>
                                {passwordsEnable &&
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_left">
                                        <input type="password" placeholder={t("Password*")} className="form-control form-control-password" name="Password" value={loginInfo.password}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(loginInfo));
                                                   temp.password = e.target.value;
                                                   temp.password = e.target.value.replace(/\s/g, '');
                                                   temp.password = temp.password.replace(/[^0-9A-Za-z\s]/g, '');
                                                   setLoginInfo(temp);
                                                   if (temp.password === temp.passwordConfirm)
                                                       setPasswordMatch(true);
                                                   else
                                                       setPasswordMatch(false);
                                                   setAddress2Enable(false);
                                                   checkPasswordStrength(temp.password);
                                               }}
                                               onClick={()=>setShowPasswordValidation(true)}
                                        />
                                        {showPasswordValidation && <div className="input_not_valid_password ">
                                            <h2 className="input_not_valid_password_title">{t("Your password must contain:")}</h2>
                                            <ul className="input_not_valid_password_list">
                                                <li className={"input_not_valid_password_item " + (passwordValidation.count ? "input_not_valid_password_item_check" : "")}>{t("password_required_text1")}
                                                </li>
                                                <li className={"input_not_valid_password_item " + (passwordValidation.lowercase ? "input_not_valid_password_item_check" : "")}>{t("password_required_text2")}
                                                </li>
                                                <li className={"input_not_valid_password_item " + (passwordValidation.uppercase ? "input_not_valid_password_item_check" : "")}>{t("password_required_text3")}
                                                </li>
                                                <li className={"input_not_valid_password_item " + (passwordValidation.numbers ? "input_not_valid_password_item_check" : "")}>{t("password_required_text4")}</li>
                                            </ul>
                                        </div>
                                        }
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                        <input type="password" placeholder={t("Confirm Password*")} className="form-control form-control-password" name="PasswordConfirm" value={loginInfo.passwordConfirm}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(loginInfo));
                                                   temp.passwordConfirm = e.target.value;
                                                   setLoginInfo(temp);
                                                   if (temp.password === temp.passwordConfirm)
                                                       setPasswordMatch(true);
                                                   else
                                                       setPasswordMatch(false);
                                                   setAddress2Enable(false);
                                               }}/>
                                    </div>
                                </div>
                                }
                                {passwordsEnable && passwordMatch &&
                                <div className="checkout_left_info_shipping_address">
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_radios">
                                            <div className="radio_style">
                                                <input className="radio" type="radio" checked={!address2Enable} name="checkout_address" id="1"
                                                       onClick={e => {
                                                           setAddress2Enable(false);
                                                       }}/>
                                                <label htmlFor="1">{t("SHIP TO ABOVE ADDRESS")}</label>
                                            </div>
                                            <div className="radio_style">
                                                <input className="radio" type="radio" checked={address2Enable} name="checkout_address" id="2"
                                                       onClick={e => {
                                                           setAddress2Enable(true);
                                                       }
                                                       }/>
                                                <label htmlFor="2">{t("SHIP TO NEW ADDRESS")}<br/></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                            
                            
                            {passwordsEnable && passwordMatch && address2Enable &&
                            <div className="checkout_left_info_shipping_address checkout_left_info_shipping_address2">
                                {/*<div className="checkout_left_info_flex checkout_left_info_flex_title">*/}
                                {/*    <div className="checkout_left_info_flex_left">*/}
                                {/*        <h1 className="checkout_left_info_title">*/}
                                {/*        </h1>*/}
                                {/*    </div>*/}
                                {/*    <div className="checkout_left_info_flex_right">*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_left">
                                        <input type="text" placeholder={t("First Name*")} className="form-control" name="Name2" value={address2["Name"]}
                                               onChange={(e) => {
                                                   setAddress(2, "Name", e.target.value);
                                               }}/>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                        <input type="text" placeholder={t("Last Name*")} className="form-control" name="Last2" value={address2["Last"]}
                                               onChange={(e) => {
                                                   setAddress(2, "Last", e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_all">
                                        <input type="text" placeholder={t("Address 1*")} className="form-control" name="Address12" value={address2["Address2"]}
                                               onChange={(e) => {
                                                   setAddress(2, "Address1", e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    <div className="checkout_left_info_flex_all">
                                        <input type="text" placeholder={t("Address 2*")} className="form-control" name="Address22" value={address2["Address2"]}
                                               onChange={(e) => {
                                                   setAddress(2, "Address2", e.target.value);
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
                                        <input type="text" placeholder={t("Zip Code*")} className="form-control" name="ZipCode2" value={address2["ZipCode"]}
                                               onChange={(e) => {
                                                   setAddress(2, "ZipCode", e.target.value);
                                               }}/>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                        <input type="text" placeholder={t("Phone Number*")} className="form-control" name="PhoneNumber2" value={address2["PhoneNumber"]}
                                               onChange={(e) => {
                                                   setAddress(2, "PhoneNumber", e.target.value);
                                               }}/>
                                    </div>
                                </div>
                            </div>
                            }
                        
                        </div>
                        <div className="checkout_left_payment">
                            <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                <div className="checkout_left_info_flex_left">
                                    <h1 className="checkout_left_info_title">{t("PLEASE SELECT A PAYMENT METHOD")}</h1>
                                </div>
                                <div className="checkout_left_info_flex_right">
                                </div>
                            </div>
                            <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                <div className="checkout_left_info_flex_all">
                                    <ul className="box-list gateway-list">
                                        <li className={bank === 1 ? "selected" : ""}>
                                            <input className="radio" type="radio" value={bank === 1} name="bank" id="bank1"
                                                   onClick={e => {
                                                       setBank(1);
                                                   }
                                                   }/>
                                            <label htmlFor="bank1">
                                                <img src={require('../Images/public/bank-saman.png')} className="img-fluid" alt=""/>
                                            </label>
                                        
                                        </li>
                                        <li className={bank === 2 ? "selected" : ""}>
                                            <input className="radio" type="radio" value={bank === 2} name="bank" id="bank2"
                                                   onClick={e => {
                                                       setBank(2);
                                                   }
                                                   }/>
                                            <label htmlFor="bank2">
                                                <img src={require('../Images/public/bank-mellat.png')} className="img-fluid" alt=""/>
                                            </label>
                                        </li>
                                        <li className={bank === 3 ? "selected" : ""}>
                                            <input className="radio" type="radio" value={bank === 3} name="bank" id="bank3"
                                                   onClick={e => {
                                                       setBank(3);
                                                   }
                                                   }/>
                                            <label htmlFor="bank3">
                                                <img src={require('../Images/public/bank-parsian.png')} className="img-fluid" alt=""/>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                <div className="checkout_left_info_flex_left">
                                    <button className="checkout_payment_button">{t("Continue to Payment")}</button>
                                </div>
                                <div className="checkout_left_info_flex_right">
                                    <Link to={"/" + pageLanguage + "/Basket"} className="checkout_payment_button_return"><span>{t("Return to Bag")}</span><i className="arrow-back"/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="checkout_right">
                    <div className="checkout_right_container">
                        <ul className="checkout_right_cart_items">
                            {draperyList}
                        </ul>
                        <div className="checkout_right_discount">
                            <div className="checkout_right_discount_container">
                                <input type="text" className="checkout_right_discount_input" placeholder={t("Discount Code")} value={discount}
                                       onChange={(e) => setDiscount(e.target.value)}/>
                                <div className="checkout_right_discount_apply_container">
                                    <button className="checkout_right_discount_apply" disabled={discount === ""} onClick={() => checkDiscount()}>{t("Apply")}</button>
                                </div>
                            </div>
                            {discountApplied &&
                            <div className="discount_applied_container">
                                <span className="discount_applied">
                                    <img src={require('../Images/public/discount.svg').default} className="img-fluid discount_applied_img" alt=""/>
                                    <p className="discount_applied_text">{discountAppliedText}</p>
                                    <button className="discount_applied_remove" onClick={() => removeDiscount()}>X</button>
                                </span>
                            </div>
                            }
                        </div>
                        <div className="checkout_right_price_detail">
                            <span className="checkout_right_price_sub payment_price_detail">
                                <h3>{t("SUBTOTAL")}</h3>
                                <h4>{GetPrice(totalPrice,pageLanguage,t("TOMANS"))}</h4>
                            </span>
                            <span className="checkout_right_price_sub payment_price_detail">
                                <h3>{t("SHIPPING")}</h3>
                                <h4>{shippingPrice>0? GetPrice(shippingPrice,pageLanguage,t("TOMANS")):t("FREE")}</h4>
                            </span>
                        </div>
                        <div className="checkout_right_price_detail">
                            <span className="checkout_right_price_total payment_price_detail">
                                <h3>{t("TOTAL")}</h3>
                                <h4>{GetPrice((totalPrice+shippingPrice),pageLanguage,t("TOMANS"))}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        
        
        </div>
    
    );
}

export default Checkout;