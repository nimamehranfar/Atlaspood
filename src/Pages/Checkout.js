import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
// import CartInfo from "../Components/CartInfo";
import UserProjects from "../Components/UserProjects";
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
import PopoverStickOnClick from "../Components/PopoverStickOnClick";
import {useDispatch, useSelector} from "react-redux";
import jwt from "jwt-decode";
import store from "../store";
import {LOGOUT, ShowLoginModal} from "../Actions/types";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";
import CustomControlStaticPlaceholder from "../Components/CustomControlStaticPlaceholder";
import CustomControlFiles from "../Components/CustomControlFiles";
import Dropdown from "react-bootstrap/Dropdown";
import GetMeasurementArray from "../Components/GetMeasurementArray";
import GetUserProjectData from "../Components/GetUserProjectData";
import {convertToPersian, NumToFa} from "../Components/TextTransform";
import {Accordion, AccordionContext, useAccordionButton} from "react-bootstrap";
import {CapitalizeAllWords, Uppercase} from "../Components/TextTransform";

const baseURLPrice = "https://api.atlaspood.ir/Sewing/GetSewingOrderPrice";
const baseURLGetAddress = "https://api.atlaspood.ir/user/GetAddress";
const baseURLGetStates = "https://api.atlaspood.ir/City/GetStates";
const baseURLGetCities = "https://api.atlaspood.ir/City/GetCities/";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";
const baseURLAddDiscount = "https://api.atlaspood.ir/Cart/AddDiscountCode";
const baseURLAddDiscountGuest = "https://api.atlaspood.ir/Cart/AddGuestDiscountCode";
const baseURLDeleteDiscount = "https://api.atlaspood.ir/Cart/DeleteDiscountCode";


function Checkout() {
    const {t, i18n} = useTranslation();
    const location = useLocation();
    const {swatchOnly} = useParams();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {isLoggedIn, isRegistered, user, showLogin} = useSelector((state) => state.auth);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [userName, setUserName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");
    
    const [noShipping, setNoShipping] = useState(false);
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [installPrice, setInstallPrice] = useState(0);
    const [transportPrice, setTransportPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalSaving, setTotalSaving] = useState(0);
    const [cart, setCart] = useState({});
    const [drapery, setDrapery] = useState([]);
    const [discounts, setDiscounts] = useState([]);
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
    const [discountErr, setDiscountErr] = useState("");
    const [discountList, setDiscountList] = useState([]);
    
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [emailNews, setEmailNews] = useState(false);
    const [passwordsEnable, setPasswordsEnable] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordNotValidState, setPasswordNotValidState] = useState(0);
    const [passwordNotValid, setPasswordNotValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        count: false,
        lowercase: false,
        uppercase: false,
        numbers: false
    });
    
    const [emailNotValid, setEmailNotValid] = useState(false);
    const [mobileErrorState, setMobileErrorState] = useState(0);
    const [emailErrorState, setEmailErrorState] = useState(0);
    
    const [firstNotExist, setFirstNotExist] = useState(false);
    const [lastNotExist, setLastNotExist] = useState(false);
    const [emailNotExist, setEmailNotExist] = useState(false);
    const [mobileNotExist, setMobileNotExist] = useState(false);
    const [address1NotExist, setAddress1NotExist] = useState(false);
    const [zipCodeNotExist, setZipCodeNotExist] = useState(false);
    
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
    
    const emailError = {
        "en": [
            {error: "Please include an '@' in the email address."},
            {error: "A part following '@' should not contain the symbol '@'."},
            {error: "Please enter a part followed by '@'."},
            {error: "Please enter a part following '@'."},
            {error: "Please include an '.' in the part following '@'."},
            {error: "'.' is used at a wrong position"},
            {error: "Please enter a part followed by '.'."},
            {error: "The email is invalid."},
            {error: "This email address is already associated with an account."}
        ],
        "fa": [
            {error: "ایمیل شما بایستی نماد '@' داشته باشد."},
            {error: "بخش پس از '@' نباید دارای نماد '@' باشد."},
            {error: "بخش قبل از '@' را وارد کنید."},
            {error: "بخش پس از '@' را وارد کنید."},
            {error: "لطفا یک '.' را در قسمت بعد '@' وارد کنید."},
            {error: "'.' در مکان نادرستی استفاده شده است."},
            {error: "بخش پس از '.' را وارد کنید."},
            {error: "ایمیل نادرست میباشد."},
            {error: "این آدرس ایمیل با حساب کاربری دیگری مرتبط است."}
        ],
    };
    
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
    const [address2Enable, setAddress2Enable] = useState(false);
    const [address2, setAddress2] = useState({});
    const [bank, setBank] = useState(1);
    
    
    const [userAddress, setUserAddress] = useState([]);
    const [hasAddress, setHasAddress] = useState(false);
    const [userAddressRender, setUserAddressRender] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [tempCity, setTempCity] = useState([]);
    const [tempCityId, setTempCityId] = useState(undefined);
    
    const popperConfig = {
        strategy: "fixed"
    };
    
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
            } else {
                setPasswordNotValidState(0);
            }
        }
        
        temp.count = user_password.length <= 20 && user_password.length >= 8;
        
        temp.uppercase = new RegExp("[A-Z]").test(user_password);
        
        temp.lowercase = new RegExp("[a-z]").test(user_password);
        
        temp.numbers = new RegExp("[0-9]").test(user_password);
        
        setPasswordValidation(temp);
        
    }
    
    
    const validateEmail = (email) => {
        if (email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/
        )) {
            return true;
        } else {
            if (!email.includes('@')) {
                setEmailErrorState(0);
            } else {
                const myArray = email.split("@");
                if (myArray.length - 1 > 1) {
                    setEmailErrorState(1);
                } else if (myArray[0] === "") {
                    setEmailErrorState(2);
                } else if (myArray[1] === "") {
                    setEmailErrorState(3);
                } else if (!myArray[1].includes('.')) {
                    setEmailErrorState(4);
                } else {
                    const myArray2 = myArray[1].split(".");
                    if (myArray2[0] === "") {
                        setEmailErrorState(5);
                    } else if (myArray2.pop() === "") {
                        setEmailErrorState(6);
                    } else {
                        setEmailErrorState(7);
                    }
                }
                return false;
            }
        }
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
    
    function validateInputs() {
        let temp = JSON.parse(JSON.stringify(address1));
        if (temp["Name"] === "") {
            setFirstNotExist(true);
        }
        if (loginInfo.email === "") {
            setEmailNotExist(true);
            setEmailNotValid(false);
        } else if (!validateEmail(loginInfo.email)) {
            setEmailNotExist(false);
            setEmailNotValid(true);
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
    
    function checkDiscount() {
        let discountText = JSON.parse(JSON.stringify(discount));
        
        if(isLoggedIn) {
            axios.post(baseURLAddDiscount, {}, {
                params: {
                    code: discountText
                },
                headers: authHeader()
            }).then((response) => {
                setDiscount("");
                setDiscountErr("");
    
                setCart(response.data ? response.data : {});
            }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            checkDiscount();
                        } else {
                        }
                    });
                } else {
                    setDiscountErr(err.response.data.toString());
                }
            });
        }
        else{
            let postObj={
                "CartId": 0,
                "UserId": 0,
                "TotalAmount": 0,
                "InstallAmount": 0,
                "TransportationAmount": 0,
                "TotalDiscount": 0,
                "PayableAmount": 0,
                "CartDetails": [],
                "DiscountCodes": []
            }
            if (localStorage.getItem("cart") !== null) {
                let cartObj = JSON.parse(localStorage.getItem("cart"));
                let draperies = cartObj["drapery"] ||[];
                if(draperies.length){
                    let promiseArr = [];
                    Object.keys(draperies).forEach((key, index) => {
                        promiseArr[index] = new Promise((resolve, reject) => {
                            postObj["CartDetails"][index]={
                                "CartDetailId": index,
                                "CartId": 0,
                                "TypeId": 6403,
                                "Discount": 0,
                                "Count": draperies[index]["Count"],
                                "ProductId": null,
                                "ProductName": null,
                                "ProductEnName": null,
                                "ProductGroupId": null,
                                "ProductDesignCode": null,
                                "SewingPreorderId": index,
                                "PhotoUrl": null,
                                "ProductDesignEnName": null,
                                "ProductDesignName": null,
                                "ProductColorEnName": null,
                                "ProductColorName": null,
                                "ProductColorId": null,
                                "UnitPrice": draperies[index]["Price"],
                                "Amount": draperies[index]["Price"]*draperies[index]["Count"],
                                "PayableAmount": draperies[index]["Price"]*draperies[index]["Count"],
                                "SewingPreorder": {
                                    "SewingPreorderId": index,
                                    "IsCompleted": true,
                                    ...draperies[index]
                                }
                            };
                            postObj["TotalAmount"]+=draperies[index]["Price"]*draperies[index]["Count"];
                            if(draperies[index]["ZipCode"] && draperies[index]["ZipCode"]!==""){
                                postObj["InstallAmount"]+=draperies[index]["InstallAmount"]||0;
                                if(postObj["InstallAmount"]===0){
                                    postObj["TransportationAmount"]=draperies[index]["TransportationAmount"]||0;
                                }
                            }
                            resolve();
                        })
                    });
                    Promise.all(promiseArr).then(() => {
                        postObj["PayableAmount"]=postObj["TotalAmount"]+postObj["InstallAmount"]+postObj["TransportationAmount"];
                        axios.post(baseURLAddDiscountGuest, postObj, {
                            params: {
                                code: discountText
                            }
                        }).then((response) => {
    
                            setTotalSaving(response.data["TotalDiscount"]);
                            setDiscounts(response.data["DiscountCodes"]);
                            setDiscount("");
                            setDiscountErr("");
                            
                            if (localStorage.getItem("cart") !== null) {
                                let cartObj = JSON.parse(localStorage.getItem("cart"));
                                let temp = cartObj["drapery"];
                                let promiseArr = [];
    
                                response.data["CartDetails"].forEach((tempObj, index) => {
                                    promiseArr[index] = new Promise((resolve, reject) => {
                                        temp[tempObj["CartDetailId"]]["Discount"]=tempObj["Discount"];
                                        temp[tempObj["CartDetailId"]]["PreorderText"]["Discount"]=tempObj["Discount"];
                                        resolve();
                                    })
                                })
        
                                Promise.all(promiseArr).then(() => {
                                    cartObj["drapery"] = temp;
                                    localStorage.setItem('cart', JSON.stringify(cartObj));
                                    setCartChanged(cartChanged + 1);
                                })
                            } else {
                                setCartChanged(cartChanged + 1);
                            }
                            // localStorage.setItem('discount', JSON.stringify(response.data["DiscountCodes"]));
                        }).catch(err => {
                            setDiscountErr(err.response.data.toString());
                        });
                    })
                }
            }
        }
    }
    
    function removeDiscount(discountText) {
        axios.delete(baseURLDeleteDiscount, {
            params: {
                code: discountText
            },
            headers: authHeader()
        }).then((response) => {
            setCartChanged(cartChanged + 1);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        removeDiscount(discountText);
                    } else {
                    }
                });
            } else {
            }
        });
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
    
    function logoutUser() {
        if (localStorage.getItem("user") !== null) {
            localStorage.removeItem("user");
        }
        
        store.dispatch({
            type: LOGOUT,
        });
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
    
    function renderUserAddress() {
        
        let arrayObj = userAddress.map(item => {
            return {
                value: item["CustomerAddressId"],
                label: `${t("Iran")} ${pageLanguage === "fa" ? item["CityName"] : item["CityEnName"]} ${item["Address"]} ${item["Address2"]} ${item["ZipCode"]}`
            };
        });
        
        let finalArray = [{
            value: -1,
            label: "Create a new address"
        }];
        setUserAddressRender([...finalArray, ...arrayObj]);
        setHasAddress(true);
        
        let tempIndex = userAddress.findIndex(opt => opt["IsDefault"] === true);
        if (tempIndex === -1) {
            tempIndex = 0
        }
        if (localStorage.getItem("user") !== null && isLoggedIn) {
            let tempObj = JSON.parse(localStorage.getItem("user"));
            
            setAddress1({
                id: "",
                Name: `${jwt(tempObj["access_token"])["FirstName"]}`,
                Last: `${jwt(tempObj["access_token"])["LastName"]}`,
                Address1: userAddress[tempIndex]["Address"],
                Address2: userAddress[tempIndex]["Address2"],
                State: userAddress[tempIndex]["StateId"],
                City: userAddress[tempIndex]["CityId"],
                ZipCode: userAddress[tempIndex]["ZipCode"],
                PhoneNumber: userAddress[tempIndex]["Mobile"]
            });
            
            setTempCityId(userAddress[tempIndex]["CityId"]);
            setTimeout(() => {
                setSelectedState(states.find(opt => opt.value === userAddress[tempIndex]["ZoneNo"]) ? [states.find(opt => opt.value === userAddress[tempIndex]["ZoneNo"])] : []);
                if (states.find(opt => opt.value === userAddress[tempIndex]["ZoneNo"])) {
                } else {
                    setSelectedCity([]);
                    setCities([]);
                }
            }, 200);
        }
    }
    
    function getCities(pageLang, stateId) {
        if (stateId === undefined) {
            axios.get(baseURLGetStates, {
                headers: authHeader()
            })
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
            axios.get(baseURLGetCities + stateId, {
                headers: authHeader()
            })
                .then((response) => {
                    let arrayObj = response.data.map(item => {
                        return {
                            value: item["CityId"],
                            label: pageLang === "fa" ? item["CityName"] : item["CityEnName"]
                        };
                    });
                    if (tempCityId) {
                        let tempValue = JSON.parse(JSON.stringify(tempCityId));
                        setTempCityId(undefined);
                        setTempCity([]);
                        setTimeout(() => {
                            // console.log(tempValue);
                            setSelectedCity(arrayObj.find(opt => opt.value === tempValue) ? [arrayObj.find(opt => opt.value === tempValue)] : []);
                        }, 50);
                    } else if (tempCity.length) {
                        let tempValue = tempCity[0].value;
                        setTempCity([]);
                        setTimeout(() => {
                            setSelectedCity([arrayObj.find(opt => opt.value === tempValue)]);
                        }, 50);
                    } else {
                        setSelectedCity([]);
                        setAddress(1, "City", "");
                    }
                    // console.log(arrayObj);
                    setCities(arrayObj);
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
        setSelectedCity([]);
        setSelectedState([]);
    }
    
    function setAllAddress(tempValue) {
        let tempIndex = userAddress.findIndex(opt => opt["CustomerAddressId"] === tempValue);
        if (tempIndex === -1) {
            clearAddressFields();
        }
        if (localStorage.getItem("user") !== null && isLoggedIn) {
            let tempObj = JSON.parse(localStorage.getItem("user"));
            
            setAddress1({
                id: "",
                Name: userAddress[tempIndex]["FirstName"],
                Last: userAddress[tempIndex]["LastName"],
                Address1: userAddress[tempIndex]["Address"],
                Address2: userAddress[tempIndex]["Address2"],
                State: userAddress[tempIndex]["StateId"],
                City: userAddress[tempIndex]["CityId"],
                ZipCode: userAddress[tempIndex]["ZipCode"],
                PhoneNumber: userAddress[tempIndex]["Mobile"]
            });
            
            setTempCityId(userAddress[tempIndex]["CityId"]);
            setTimeout(() => {
                setSelectedState(states.find(opt => opt.value === userAddress[tempIndex]["ZoneNo"]) ? [states.find(opt => opt.value === userAddress[tempIndex]["ZoneNo"])] : []);
                if (states.find(opt => opt.value === userAddress[tempIndex]["ZoneNo"])) {
                } else {
                    setSelectedCity([]);
                    setCities([]);
                }
            }, 300);
        }
    }
    
    function ContextAwareToggleViewDetails({eventKey, callback, textOnHide, textOnShow}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        return (
            <button
                className="basket_item_title_dropdown_btn"
                aria-expanded={`${isCurrentEventKey}`}
                type="button"
                onClick={decoratedOnClick}
            >
                <h4 className="dk_curtain_preview_item_details">{isCurrentEventKey ? textOnShow : textOnHide}</h4>
            </button>
        );
    }
    
    useEffect(() => {
        if (userAddress.length) {
            renderUserAddress();
        } else {
            // setHasAddress(false);
        }
    }, [userAddress]);
    
    useEffect(() => {
        if (isLoggedIn) {
            axios.get(baseURLGetCart, {
                headers: authHeader()
            }).then((response) => {
                setCart(response.data ? response.data : {});
            }).catch(err => {
                if (err.response.status === 401) {
                    refreshToken().then((response2) => {
                        if (response2 !== false) {
                            setCartChanged(cartChanged + 1);
                        } else {
                        }
                    });
                }
            });
        } else {
            if (localStorage.getItem("cart") !== null) {
                setCart(JSON.parse(localStorage.getItem("cart")));
            } else {
                setCart({});
            }
        }
    }, [cartChanged, location.pathname]);
    
    useEffect(() => {
        if (isLoggedIn) {
            setCartChanged(cartChanged + 1);
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        if (Object.keys(cart).length !== 0) {
            if (isLoggedIn) {
                if (swatchOnly === undefined) {
                    let draperies = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6403;
                    });
                    
                    let swatches = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6402;
                    });
                    setSubTotalPrice(cart["TotalAmount"]);
                    setInstallPrice(cart["InstallAmount"]);
                    setTransportPrice(cart["TransportationAmount"]);
                    setTotalPrice(cart["PayableAmount"]);
                    setTotalSaving(cart["TotalDiscount"]);
                    setDrapery(draperies);
                    setDraperyCount(draperies.length);
                    setSwatches(swatches);
                    setSwatchesCount(swatches.length);
                    setDiscounts(cart["DiscountCodes"]);
                } else if (swatchOnly && swatchOnly === "Swatches") {
                    let swatches = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6402;
                    });
                    setSwatches(swatches);
                    setSwatchesCount(swatches.length);
                    setDiscounts(cart["DiscountCodes"]);
                } else {
                    navigate("/" + pageLanguage);
                }
            } else {
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
            }
        }
    }, [cart]);
    
    useEffect(() => {
        if (isLoggedIn) {
            let projectData = JSON.parse(JSON.stringify(UserProjects));
            let temp = [];
            let tempNoShip = true;
            let promise2 = new Promise((resolve, reject) => {
                drapery.sort(function(a, b) {
                    return b["CartDetailId"] - a["CartDetailId"]  ||  b["SewingPreorderId"] - a["SewingPreorderId"];
                }).forEach((tempObj,i)=>{
                    let projectDataObj = projectData[drapery[i]["SewingPreorder"]["SewingModelId"]];
                    let desc = [];
                    let projectId = drapery[i]["SewingPreorderId"];
                    drapery[i]["PreorderText"] = {};
                    // let obj={};
                    let obj = drapery[i]["SewingPreorder"]["PreorderText"];
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
                    let ModelId = obj["ModelId"];
                    let hasDiscount = drapery[i]["Discount"] > 0;
                    let SewingModelId = obj["SewingModelId"];
                    let zipcode = obj["ZipCode"];
                    obj["Price"] = drapery[i]["PayableAmount"];
                    obj["qty"] = drapery[i]["WindowCount"];
                    
                    if (tempNoShip) {
                        tempNoShip = zipcode && zipcode !== "";
                    }
                    if (projectDataObj) {
                        let promise1 = new Promise((resolve, reject) => {
                            projectDataObj["data"].forEach((tempObj, index) => {
                                if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                    let objLabel = "";
                                    if (obj[tempObj["apiLabel"]] === undefined) {
                                    } else {
                                        let apiValue = obj[tempObj["apiLabel"]] === null ? "null" : obj[tempObj["apiLabel"]].toString();
                                        if (tempObj["apiLabel"] === "ControlType" && obj["ControlType"] === "Motorized") {
                                            objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(obj[tempObj["apiLabel"]].toString())} / ${t(obj["MotorType"].toString())}`).toString() : `${t(obj[tempObj["apiLabel"]].toString())} / ${t(obj["MotorType"].toString())}`;
                                        } else if (tempObj["titleValue"] === null) {
                                            if (tempObj["titlePostfix"] === "") {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(apiValue)}`).toString() : t(apiValue);
                                            } else {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue + t(tempObj["titlePostfix"]);
                                            }
                                        } else {
                                            if (tempObj["titleValue"][apiValue] === null) {
                                                if (tempObj["titlePostfix"] === "") {
                                                    objLabel = t(apiValue);
                                                } else {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue.toString() + t(tempObj["titlePostfix"]);
                                                }
                                            } else {
                                                objLabel = t(tempObj["titleValue"][apiValue]);
                                            }
                                        }
                                        desc[tempObj["order"]] =
                                            <div className="basket_item_title_desc" key={tempObj + tempObj["order"]}>
                                                <h3>{t(tempObj["title"])}&nbsp;</h3>
                                                <h4>{objLabel}</h4>
                                            </div>;
                                    }
                                    
                                    if (index === projectDataObj["data"].length - 1) {
                                        resolve();
                                    }
                                } else {
                                    if (index === projectDataObj["data"].length - 1) {
                                        resolve();
                                    }
                                }
                                
                            });
                        });
                        
                        promise1.then(() => {
                            if (obj["SewingModelId"] === "0326") {
                                desc = [
                                    <div className="basket_item_title_desc" key={"fabric/color"}>
                                        <h3>{t("Fabric/Color")}&nbsp;</h3>
                                        <h4>{obj["SodFabrics"].map((item, i) =>
                                            <div key={i}
                                                 className="dk_curtain_preview_detail">
                                                <h2>{(pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["DesignEnName"]) : item["FabricObj"]["DesignName"]).toString() + " / " + (pageLanguage === 'en' ? CapitalizeAllWords(item["FabricObj"]["ColorEnName"]) : item["FabricObj"]["ColorName"]).toString()}</h2>
                                                <h5>&nbsp;X</h5><h3>{item["Qty"]}</h3>
                                            </div>)}
                                        </h4>
                                    </div>
                                    , ...desc];
                            }
                            // console.log(desc);
                            temp[i] =
                                <li className="checkout_item_container" key={i}>
                                    <div className="checkout_item_image_container">
                                        <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="checkout_item_img"/>
                                        <p className="checkout_item_image_qty">{pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj["WindowCount"]}`) : obj["WindowCount"]}</p>
                                    </div>
                                    <div className={`checkout_item_desc_container  ${!hasDiscount ? "checkout_item_desc_container_without_discount" : ""}`}>
                                        <div className="checkout_item">
                                            <h1 className="checkout_item_name">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h1>
                                            <div className="checkout_item_price_section">
                                                <span
                                                    className={`checkout_item_price ${hasDiscount ? "checkout_item_price_with_discount" : ""}`}>{GetPrice(hasDiscount? drapery[i]["Amount"]:obj["Price"], pageLanguage, t("TOMANS"))}</span>
                                                {hasDiscount &&
                                                    <span className="checkout_item_price">{GetPrice(drapery[i]["PayableAmount"], pageLanguage, t("TOMANS"))}</span>}
                                            </div>
                                        </div>
                                        
                                        <h4 className="checkout_item_room_name">{pageLanguage === 'fa' ? roomNameFa + " / " + WindowName : roomName + " / " + WindowName}</h4>
                                        
                                        {/*<PopoverStickOnClick classNames="checkout_view_detail_popover"*/}
                                        {/*                     placement="bottom"*/}
                                        {/*                     children={<h2 className="checkout_item_details">{t("View Details")}</h2>}*/}
                                        {/*                     children2={<h2 className="checkout_item_details">{t("Hide Details")}</h2>}*/}
                                        {/*                     component={*/}
                                        {/*                         <div className="basket_item_title_container">*/}
                                        {/*                             {desc}*/}
                                        {/*                         </div>*/}
                                        {/*                     }/>*/}
                                        {/*<div className="checkout_item_dropdown">
											<Dropdown autoClose="outside" title="" align={{sm: pageLanguage === "fa" ? "end" : "start"}}>
												<Dropdown.Toggle className="basket_item_title_dropdown_btn" style={{ position: "static" }}>
													<h2 className="checkout_item_details">{t("View Details")}</h2>
													<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>
												</Dropdown.Toggle>
												<Dropdown.Menu container={'body'} popperConfig={{ strategy: "fixed" }} positionFixed={true} className="basket_view_detail_popover">
													<div className="basket_item_title_container">
														{desc}
													</div>
												</Dropdown.Menu>
											</Dropdown>
										</div>*/}
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                    <div className="basket_item_title_container">
                                                        {desc}
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        {hasDiscount &&
                                            <span className="checkout_item_discount">{t('Discount')} (-{GetPrice(drapery[i]["Discount"], pageLanguage, t("TOMANS"))})</span>}
                                    </div>
                                </li>;
                        });
                        if (i === drapery.length - 1) {
                            resolve();
                        }
                    }
                })
            });
            promise2.then(() => {
                setDraperyList(temp);
                setNoShipping(tempNoShip);
            });
        } else {
            if (drapery.length) {
                let tempDrapery = drapery;
                // let cartInfo = JSON.parse(JSON.stringify(CartInfo));
                let temp = [];
                let delArr = [];
                
                let draperiesTotalPrice = 0;
                let draperiesTotalInstall = 0;
                let draperiesTotalTransport = 0;
                let promiseArr = [];
                let tempNoShip = true;
                
                tempDrapery.forEach((obj, index) => {
                    let tempPostObj = {};
                    let userProjects = JSON.parse(JSON.stringify(UserProjects))[obj["PreorderText"]["SewingModelId"]]["data"];
                    // let obj = obj1["PreorderText"];
                    
                    promiseArr[index] = new Promise((resolve, reject) => {
                        GetUserProjectData(obj).then((temp) => {
                            tempPostObj["WindowCount"] = 1;
                            tempPostObj["SewingModelId"] = obj["SewingModelId"];
                            Object.keys(temp).forEach(key => {
                                if (temp[key] !== null || temp[key] !== "") {
                                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                                    // console.log(key,tempObj);
                                    if (tempObj && tempObj["apiLabel"] !== "") {
                                        if (tempObj["apiValue"] === null) {
                                            tempPostObj[tempObj["apiLabel"]] = temp[key];
                                        } else {
                                            tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                                        }
                                    }
                                }
                            });
                            
                            tempPostObj["SewingOrderDetails"] = [];
                            tempPostObj["SewingOrderDetails"][0] = {};
                            tempPostObj["SewingOrderDetails"][0]["CurtainPartId"] = 2303;
                            tempPostObj["SewingOrderDetails"][0]["SewingModelId"] = obj["SewingModelId"];
                            tempPostObj["SewingOrderDetails"][0]["IsLowWrinkle"] = true;
                            tempPostObj["SewingOrderDetails"][0]["IsCoverAll"] = true;
                            tempPostObj["SewingOrderDetails"][0]["IsAltogether"] = true;
                            Object.keys(temp).forEach(key => {
                                if (temp[key] !== null || temp[key] !== "") {
                                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                                    if (tempObj["apiLabel2"] !== undefined) {
                                        if (tempObj["apiValue2"] === null) {
                                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = temp[key];
                                        } else {
                                            tempPostObj["SewingOrderDetails"][0][tempObj["apiLabel2"]] = tempObj["apiValue2"][temp[key]];
                                        }
                                    }
                                }
                            });
                            tempPostObj["SewingOrderDetails"][0]["Accessories"] = [];
                            Object.keys(temp).forEach(key => {
                                if (temp[key] !== null || temp[key] !== "") {
                                    let tempObj = userProjects.find(obj => obj["cart"] === key);
                                    if (tempObj["apiAcc"] !== undefined) {
                                        if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                                            tempPostObj["SewingOrderDetails"][0]["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                                        } else {
                                        
                                        }
                                    }
                                }
                            });
                            if (obj["PreorderText"]["Accessories"] && obj["PreorderText"]["Accessories"].filter(n => n).length > 0) {
                                tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].concat(obj["PreorderText"]["Accessories"])
                                let uniqueAcc = [...tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(n => n).reduce((map, obj) => map.set(obj.SewingAccessoryValue, obj), new Map()).values()];
                                tempPostObj["SewingOrderDetails"][0]["Accessories"] = uniqueAcc.filter(function (el) {
                                    return el != null;
                                });
                            } else {
                                tempPostObj["SewingOrderDetails"][0]["Accessories"] = tempPostObj["SewingOrderDetails"][0]["Accessories"].filter(function (el) {
                                    return el != null;
                                });
                            }
                            
                            // delete tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
                            // delete tempPostObj["SewingModelId"];
                            tempPostObj["SewingModelId"] = tempPostObj["SewingOrderDetails"][0]["SewingModelId"];
                            
                            if (tempPostObj["SewingOrderDetails"][0]["FabricId"] !== undefined) {
                                axios.post(baseURLPrice, tempPostObj).then((response) => {
                                    resolve(response);
                                }).catch(err => {
                                    resolve(false);
                                    // console.log("hi2");
                                });
                            } else {
                                // console.log("hi3");
                                resolve(false);
                            }
                        }).catch(err => {
                            // console.log("hi3");
                            resolve(false);
                        });
                    });
                });
                
                delArr.forEach(el => {
                    tempDrapery.splice(el, 1);
                });
                
                Promise.all(promiseArr).then(function (values) {
                    let tempDraperiesTotalTransport = values.find(function (el) {
                        return el["data"] && el["data"]["TransportationAmount"] && el["data"]["TransportationAmount"] > 0;
                    });
                    if (tempDraperiesTotalTransport && tempDraperiesTotalTransport["data"] && tempDraperiesTotalTransport["data"]["TransportationAmount"]) {
                        draperiesTotalTransport = tempDraperiesTotalTransport["data"]["TransportationAmount"]
                    } else {
                        draperiesTotalTransport = 0;
                    }
                    
                    let promise2 = new Promise((resolve, reject) => {
                        tempDrapery.forEach((obj1, index) => {
                            let obj = obj1["PreorderText"];
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
                            let SewingModelId = obj["SewingModelId"];
                            let zipcode = obj["ZipCode"];
                            let hasDiscount = obj1["Discount"] > 0 && discountList.length>0;
                            let desc = [];
                            obj["Price"] = values[index].data["price"] / obj1["WindowCount"];
                            obj1["Price"] = values[index].data["price"] / obj1["WindowCount"];
                            obj["InstallAmount"] = values[index].data["InstallAmount"] ? values[index].data["InstallAmount"] : 0;
                            obj["TransportationAmount"] = values[index].data["TransportationAmount"] ? values[index].data["TransportationAmount"] : 0;
                            draperiesTotalPrice += values[index].data["price"];
                            draperiesTotalInstall += values[index].data["InstallAmount"];
                            
                            if (tempNoShip) {
                                tempNoShip = zipcode && zipcode !== "";
                            }
                            
                            let promiseArr2 = [];
                            let userProjects = JSON.parse(JSON.stringify(UserProjects))[obj["SewingModelId"]]["data"];
                            Object.keys(obj).forEach((key, i) => {
                                promiseArr2[i] = new Promise((resolve, reject) => {
                                    let tempObj = userProjects.find(obj => obj["apiLabel"] === key);
                                    if (tempObj === undefined) {
                                        delArr.push(index);
                                        resolve();
                                    }
                                    // else if (tempObj["apiLabel"] === "WidthCart") {
                                    //     desc[tempObj["order"]] =
                                    //         <div className="basket_item_title_desc" key={index}>
                                    //             <h3>{t("DIMENSIONS")}&nbsp;</h3>
                                    //             <h4>{NumToFa((obj["WidthCart"]) + t("Zebra Measurements W") + " \u00d7 " + obj["HeightCart"] + t("Zebra Measurements H") + t("basket Measurements cm"),pageLanguage)}</h4>
                                    //         </div>;
                                    //     resolve();
                                    // }
                                    else {
                                        if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                            let objLabel = "";
                                            let apiValue = obj[tempObj["apiLabel"]] === null ? "null" : obj[tempObj["apiLabel"]].toString();
                                            if (tempObj["apiLabel"] === "ControlType" && obj["ControlType"] === "Motorized") {
                                                objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(obj[key].toString())} / ${t(obj["MotorType"].toString())}`).toString() : `${t(obj[key].toString())} / ${t(obj["MotorType"].toString())}`;
                                            } else if (tempObj["titleValue"] === null) {
                                                if (tempObj["titlePostfix"] === "") {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${t(apiValue.toString())}`).toString() : t(apiValue.toString());
                                                } else {
                                                    objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue.toString() + t(tempObj["titlePostfix"]);
                                                }
                                            } else {
                                                if (tempObj["titleValue"][apiValue.toString()] === null) {
                                                    if (tempObj["titlePostfix"] === "") {
                                                        objLabel = t(apiValue.toString());
                                                    } else {
                                                        objLabel = pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${apiValue}`).toString() + t(tempObj["titlePostfix"]) : apiValue.toString() + t(tempObj["titlePostfix"]);
                                                    }
                                                } else {
                                                    objLabel = t(tempObj["titleValue"][apiValue.toString()]);
                                                }
                                            }
                                            desc[tempObj["order"]] =
                                                <div className="basket_item_title_desc" key={key}>
                                                    <h3>{t(tempObj["title"])}&nbsp;</h3>
                                                    <h4>{objLabel}</h4>
                                                </div>;
                                            resolve();
                                        } else {
                                            resolve();
                                        }
                                    }
                                });
                                
                            });
                            
                            Promise.all(promiseArr2).then(() => {
                                temp[tempDrapery.length-index-1] =
                                    <li className="checkout_item_container" key={index}>
                                        <div className="checkout_item_image_container">
                                            <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="checkout_item_img"/>
                                            <p className="checkout_item_image_qty">{pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${obj1["Count"]}`) : obj1["Count"]}</p>
                                        </div>
                                        <div className="checkout_item_desc_container">
                                            <div className="checkout_item">
                                                <h1 className="checkout_item_name">{pageLanguage === 'fa' ? convertToPersian(defaultModelNameFa) + " سفارشی " : "Custom " + defaultModelName}</h1>
                                                <div className="checkout_item_price_section">
                                                    <span className={`checkout_item_price ${hasDiscount ? "checkout_item_price_with_discount" : ""}`}>{GetPrice(obj1["Price"] * obj1["Count"], pageLanguage, t("TOMANS"))}</span>
                                                    {hasDiscount &&
                                                        <span className="checkout_item_price">{GetPrice((obj1["Price"] * obj1["Count"])-obj["Discount"], pageLanguage, t("TOMANS"))}</span>}
                                                </div>
                                            </div>
                                            {/*<PopoverStickOnHover classNames="basket_view_detail_popover"*/}
                                            {/*                      placement="bottom"*/}
                                            {/*                      children={<h2 className="checkout_item_details">{t("View Details")}</h2>}*/}
                                            {/*                      component={*/}
                                            {/*                          <div className="basket_item_title_container">*/}
                                            {/*                              {desc}*/}
                                            {/*                          </div>*/}
                                            {/*                      }/>*/}
                                            
                                            {/*<div className="checkout_item_dropdown">*/}
                                            {/*	<Dropdown autoClose="outside" title="" align={{sm: pageLanguage === "fa" ? "end" : "start"}}>*/}
                                            {/*		<Dropdown.Toggle className="basket_item_title_dropdown_btn">*/}
                                            {/*			<h2 className="checkout_item_details">{t("View Details")}</h2>*/}
                                            {/*			<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*/}
                                            {/*		</Dropdown.Toggle>*/}
                                            {/*		<Dropdown.Menu popperConfig={popperConfig} positionFixed={true} className="basket_view_detail_popover">*/}
                                            {/*			<div className="basket_item_title_container">*/}
                                            {/*				{desc}*/}
                                            {/*			</div>*/}
                                            {/*		</Dropdown.Menu>*/}
                                            {/*	</Dropdown>*/}
                                            {/*</div>*/}
                                            <h4 className="checkout_item_room_name">{pageLanguage === 'fa' ? roomNameFa + " / " + WindowName : roomName + " / " + WindowName}</h4>
                                            <Accordion>
                                                <Accordion.Item eventKey="0">
                                                    <ContextAwareToggleViewDetails eventKey="0" textOnHide={t("View Details")} textOnShow={t("Hide Details")}/>
                                                    <Accordion.Body className="basket_item_title_dropdown dk_curtain_preview_dropdown">
                                                        <div className="basket_item_title_container">
                                                            {desc}
                                                        </div>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                            {hasDiscount &&
                                                <span className="checkout_item_discount">{t('Discount')} (-{GetPrice(obj["Discount"], pageLanguage, t("TOMANS"))})</span>}
                                        </div>
                                    </li>;
                                if (index === tempDrapery.length - 1) {
                                    resolve();
                                }
                            });
                        });
                    });
                    
                    promise2.then(() => {
                        setDraperyList(temp);
                        if (localStorage.getItem("cart") !== null) {
                            let cartObjects = JSON.parse(localStorage.getItem("cart"));
                            cartObjects["drapery"] = tempDrapery;
                            localStorage.setItem('cart', JSON.stringify(cartObjects));
                        } else {
                            setCart({});
                        }
                        setSubTotalPrice(draperiesTotalPrice);
                        setInstallPrice(draperiesTotalInstall);
                        setTransportPrice(draperiesTotalTransport);
                        setTotalPrice(draperiesTotalPrice + draperiesTotalInstall + draperiesTotalTransport);
                        setNoShipping(tempNoShip);
                    });
                }).catch(err => {
                    console.log(err);
                });
                
            } else {
                setSubTotalPrice(0);
                setInstallPrice(0);
                setTransportPrice(0);
                setTotalPrice(0);
                setTotalSaving(0);
                setNoShipping(true);
            }
        }
    }, [drapery]);
    
    useEffect(() => {
        if (isLoggedIn) {
            let temp = [];
            let tempTotal = 0;
            let promise2 = new Promise((resolve, reject) => {
                for (let i = 0; i < swatches.length; i++) {
                    let obj = swatches[i];
                    let CartDetailId = obj["CartDetailId"];
                    let ProductName = obj["ProductName"];
                    let ProductEnName = obj["ProductEnName"];
                    let ProductDesignEnName = obj["ProductDesignEnName"];
                    let ProductDesignName = obj["ProductDesignName"];
                    let ProductColorEnName = obj["ProductColorEnName"];
                    let ProductColorName = obj["ProductColorName"];
                    let photoUrl = obj["PhotoUrl"];
                    let price = obj["PayableAmount"];
                    let count = obj["Count"];
                    tempTotal += price;
                    
                    temp[i] =
                        <li className="checkout_item_container" key={i}>
                            <div className="checkout_item_image_container">
                                <img src={`https://api.atlaspood.ir/${photoUrl}`} alt="" className="checkout_item_img"/>
                                <p className="checkout_item_image_qty">{pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${count}`) : count}</p>
                            </div>
                            <div className="checkout_item_desc_container">
                                <div className="checkout_item">
                                    <h1 className="checkout_item_name">{t("Fabric Swatch")}</h1>
                                    <span className="checkout_item_price">{price === 0 ? t("Free") : GetPrice(price * count, pageLanguage, t("TOMANS"))}</span>
                                </div>
                                <h2 className="checkout_item_details checkout_item_details_design">{pageLanguage === 'fa' ? ProductDesignName : ProductDesignEnName}</h2>
                                <span className="checkout_item_discount  checkout_item_details_color">{pageLanguage === 'fa' ? ProductColorName : ProductColorEnName}</span>
                            </div>
                        </li>;
                    if (i === swatches.length - 1) {
                        resolve();
                    }
                }
            });
            promise2.then(() => {
                setSwatchesList(temp);
                if (swatchOnly && swatchOnly === "Swatches") {
                    setTotalPrice(tempTotal);
                }
            });
        }
    }, [swatches]);
    
    useEffect(() => {
        if (discounts.length > 0) {
            let tempDiscounts = JSON.parse(JSON.stringify(discounts));
            let tempArr = [];
            let promise1 = new Promise((resolve, reject) => {
                tempDiscounts.forEach((tempObj, index) => {
                    tempArr[index] =
                        <span className="discount_applied" key={index}>
                            <img src={require('../Images/public/discount.svg').default} className="img-fluid discount_applied_img" alt=""/>
                            <p className="discount_applied_text">{tempObj["Code"]}</p>
                            <button className="btn-close discount_applied_remove" onClick={() => removeDiscount(tempObj["Code"])}/>
                        </span>;
                    
                    if (index === tempDiscounts.length - 1) {
                        resolve();
                    }
                });
            });
            
            promise1.then(() => {
                setDiscountList(tempArr);
            });
        } else {
            setDiscountList([]);
        }
    }, [discounts]);
    
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        let pageLanguage1 = tempLang.slice(1, 3).join('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        i18n.changeLanguage(pageLanguage1);
        document.body.dir = pageLanguage1 === 'fa' ? "rtl" : "ltr";
        document.body.className = pageLanguage1 === 'fa' ? "font_farsi" : "font_en";
        if (localStorage.getItem("user") !== null && isLoggedIn) {
            let tempObj = JSON.parse(localStorage.getItem("user"));
            setUserName(jwt(tempObj["access_token"])["FirstName"] + " " + jwt(tempObj["access_token"])["LastName"]);
            setUserEmail(jwt(tempObj["access_token"])["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
            getUserAddress();
        }
        getCities(tempLang.slice(1, 3).join(''));
    }, [location.pathname, isLoggedIn]);
    
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
                                        {!isLoggedIn &&
                                            <span className="checkout_left_info_text" onClick={() => dispatch({
                                                type: ShowLoginModal,
                                            })}>{t("Already have an account? ")}<p>{t("Log in")}</p></span>
                                        }
                                    </div>
                                </div>
                                <div className="checkout_left_info_flex">
                                    {!isLoggedIn &&
                                        <div className="checkout_left_info_flex_left">
                                            <input type="text" placeholder={t("Email*")} className="form-control" name="Email" value={loginInfo.email}
                                                   onChange={(e) => {
                                                       let temp = JSON.parse(JSON.stringify(loginInfo));
                                                       temp.email = e.target.value;
                                                       setLoginInfo(temp);
                                                       if (e.target.value.length > 0) {
                                                           setEmailNotExist(false);
                                                           if (validateEmail(e.target.value)) {
                                                               setEmailNotValid(false);
                                                           }
                                                       }
                                                   }}/>
                                            {emailNotValid && <div className="input_not_valid">{emailError[pageLanguage][emailErrorState]["error"]}</div>}
                                            {emailNotExist && <div className="input_not_valid">{t("Email Required.")}</div>}
                                        </div>
                                    }
                                    {isLoggedIn &&
                                        <div className="checkout_left_info_flex_left">
                                        <span className="logged_user">
                                            <h1 className="logged_user_name">{userName}</h1>
                                            <h2 className="logged_user_email">({userEmail})</h2>
                                        </span>
                                            <span className="user_logout text_underline" onClick={() => logoutUser()}>{t("LOG OUT")}</span>
                                        </div>
                                    }
                                    <div className="checkout_left_info_flex_right">
                                    </div>
                                </div>
                                {!isLoggedIn &&
                                    <div className="checkout_left_info_shipping_agree">
                                        <div className="checkout_left_info_flex">
                                            <div className="checkout_left_info_flex_checkbox">
                                                <input type="checkbox" checked={emailNews} onChange={(e) => {
                                                    setEmailNews(e.target.checked);
                                                }} id="emailNews"/>
                                                <label htmlFor="emailNews" className="checkbox_label">
                                                    <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                                                </label>
                                                <p>{t("checkout_emailNews")}</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
    
                            <div className="checkout_left_info_shipping_address">
                                <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                    <div className="checkout_left_info_flex_left">
                                        <h1 className="checkout_left_info_title">{t("SHIPPING ADDRESS")}</h1>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                    </div>
                                </div>
                                {isLoggedIn && hasAddress && userAddressRender.length > 0 &&
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_all">
                                            <div className="select_container">
                                                <Select
                                                    className="select"
                                                    placeholder={t("Select a different address")}
                                                    portal={document.body}
                                                    dropdownPosition="bottom"
                                                    dropdownHandle={false}
                                                    dropdownGap={0}
                                                    values={selectedAddress}
                                                    dropdownRenderer={
                                                        ({props, state, methods}) => <CustomDropdownWithSearch props={props} state={state} methods={methods}/>
                                                    }
                                                    contentRenderer={
                                                        ({props, state, methods}) => <CustomControlStaticPlaceholder props={props} state={state} methods={methods}/>
                                                    }
                                                    onChange={(selected) => {
                                                        if (selected.length) {
                                                            setSelectedAddress(selected);
                                                            if (selected[0].value === -1) {
                                                                clearAddressFields();
                                                            } else {
                                                                setAllAddress(selected[0].value);
                                                            }
                                                        }
                                                    }}
                                                    options={userAddressRender}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
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
                                {!isLoggedIn &&
                                    <div className="checkout_left_info_shipping_agree">
                                        <div className="checkout_left_info_flex">
                                            <div className="checkout_left_info_flex_checkbox">
                                                <input type="checkbox" checked={passwordsEnable} onChange={(e) => {
                                                    setPasswordsEnable(e.target.checked);
                                                    setAddress2Enable(false);
                                                }} id="passwordEnable"/>
                                                <label htmlFor="passwordEnable" className="checkbox_label">
                                                    <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')} alt=""/>
                                                </label>
                                                <p>{t("checkout_confirm")}</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {passwordsEnable &&
                                    <div className="checkout_left_info_flex">
                                        <div className="checkout_left_info_flex_left">
                                            <input type="password" placeholder={t("Password*")} className="form-control form-control-password" name="Password"
                                                   value={loginInfo.password}
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
                                                   onClick={() => setShowPasswordValidation(true)}
                                            />
                                            {showPasswordValidation && <div className="input_not_valid_password ">
                                                <h2 className="input_not_valid_password_title">{t("Your password must contain:")}</h2>
                                                <ul className="input_not_valid_password_list">
                                                    <li className={"input_not_valid_password_item " + (passwordValidation.count ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.count &&
                                                <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text1")}
                                            </span>
                                                    </li>
                                                    <li className={"input_not_valid_password_item " + (passwordValidation.lowercase ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.lowercase &&
                                                <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text2")}
                                            </span>
                                                    </li>
                                                    <li className={"input_not_valid_password_item " + (passwordValidation.uppercase ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.uppercase &&
                                                <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text3")}
                                            </span>
                                                    </li>
                                                    <li className={"input_not_valid_password_item " + (passwordValidation.numbers ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.numbers &&
                                                <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text4")}
                                            </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            }
                                        </div>
                                        <div className="checkout_left_info_flex_right">
                                            <input type="password" placeholder={t("Confirm Password*")} className="form-control form-control-password" name="PasswordConfirm"
                                                   value={loginInfo.passwordConfirm}
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
                                            <input type="text" placeholder={t("Address 1*")} className="form-control" name="Address12" value={address2["Address1"]}
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
                            {(totalPrice + shippingPrice) > 0 &&
                                <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                    <div className="checkout_left_info_flex_left">
                                        <h1 className="checkout_left_info_title">{t("PLEASE SELECT A PAYMENT METHOD")}</h1>
                                    </div>
                                    <div className="checkout_left_info_flex_right">
                                    </div>
                                </div>
                            }
                            
                            {(totalPrice + shippingPrice) > 0 &&
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
                            }
                            <div className="checkout_left_info_flex checkout_left_info_flex_title">
                                <div className="checkout_left_info_flex_left">
                                    {(totalPrice + shippingPrice) > 0 &&
                                        <button className="checkout_payment_button" onClick={() => validateInputs()}>{t("Continue to Payment")}</button>
                                    }
                                    {(totalPrice + shippingPrice) === 0 &&
                                        <button className="checkout_payment_button" onClick={() => validateInputs()}>{t("Submit Order")}</button>
                                    }
                                </div>
                                <div className="checkout_left_info_flex_right">
                                    <Link to={"/" + pageLanguage + "/Basket"} className="checkout_payment_button_return"><span>{t("Return to Bag")}</span><i
                                        className="arrow-back"/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="checkout_right">
                    <div className="checkout_right_container">
                        <ul className="checkout_right_cart_items">
                            {draperyList}
                            {swatchesList}
                        </ul>
                        <div className="checkout_right_discount">
                            <div className="checkout_right_discount_container">
                                <input type="text" className="checkout_right_discount_input" placeholder={t("Discount Code")} value={discount}
                                       onChange={(e) => setDiscount(e.target.value)}/>
                                <div className="checkout_right_discount_apply_container">
                                    <button className="checkout_right_discount_apply" disabled={discount === ""} onClick={() => checkDiscount()}>{t("Apply")}</button>
                                </div>
                            </div>
                            {discountErr && discountErr!=="" &&
                                <div className="discount_err_container">
                                    <h2>{discountErr}</h2>
                                </div>
                            }
                            <div className="discount_applied_container">
                                {discountList}
                            </div>
                        
                        </div>
                        <div className="checkout_right_price_detail">
                            <span className="checkout_right_price_sub payment_price_detail">
                                <h3>{t("PRODUCT TOTAL")}</h3>
                                <h4>{subTotalPrice > 0 ? GetPrice(subTotalPrice, pageLanguage, t("TOMANS")) : t("FREE")}</h4>
                            </span>
                            {installPrice > 0 &&
                                <span className="checkout_right_price_sub payment_price_detail">
                                    <h3>{t("INSTALLATION SERVICES")}</h3>
                                    <h4>{installPrice > 0 ? GetPrice(installPrice, pageLanguage, t("TOMANS")) : t("FREE")}</h4>
                                </span>
                            }
                            {transportPrice > 0 &&
                                <span className="checkout_right_price_sub payment_price_detail">
                                    <h3>{t("TRANSPORTATION FEE")}</h3>
                                    <h4>{transportPrice > 0 ? GetPrice(transportPrice, pageLanguage, t("TOMANS")) : t("FREE")}</h4>
                                </span>
                            }
                            {(!noShipping || swatches.length > 0) &&
                                <span className="checkout_right_price_sub payment_price_detail">
                                    <h3>{t("SHIPPING")}</h3>
                                    <h4>{shippingPrice > 0 ? GetPrice(shippingPrice, pageLanguage, t("TOMANS")) : t("TBD")}</h4>
                                </span>
                            }
                        </div>
                        <div className="checkout_right_price_detail">
                            <span className="checkout_right_price_total payment_price_detail">
                                <h3>{t("TOTAL")}</h3>
                                <h4>{(totalPrice + shippingPrice) === 0 ? t("Free") : GetPrice((totalPrice + shippingPrice), pageLanguage, t("TOMANS"))}</h4>
                            </span>
                            {totalSaving > 0 &&
                                <span className="checkout_right_price_sub payment_price_detail">
                                    <h3>{t("TOTAL SAVING")}</h3>
                                    <h4>{totalSaving > 0 ? GetPrice(totalSaving, pageLanguage, t("TOMANS")) : t("FREE")}</h4>
                                </span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        
        
        </div>
    
    );
}

export default Checkout;