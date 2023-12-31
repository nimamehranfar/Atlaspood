import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
// import {ReactComponent as Logoen} from '../Images/public/logoen.svg';
// import {ReactComponent as Logofa} from '../Images/public/logofa.svg';
import {ReactComponent as Logoen} from '../Images/public/logo_temp_en.svg';
import {ReactComponent as Logofa} from '../Images/public/logo_temp_fa.svg';
import {ReactComponent as Favorite} from '../Images/public/favorite.svg';
import {ReactComponent as Person} from '../Images/public/person-2.svg';
import {ReactComponent as Basket} from '../Images/public/basket-2.svg';
import axios from "axios";
import {useTranslation} from "react-i18next";
import Modal from "react-bootstrap/Modal";
import {useDispatch, useSelector} from "react-redux";
import {CartUpdatedFalse, HideLogin2Modal, HideLoginModal, LOGIN, LOGOUT, REGISTER, ShowLoginModal} from "../Actions/types";
import ModalLogin from "./ModalLogin";
import SaveUserProject from "./SaveUserProject";
import GetUserProjectData from "./GetUserProjectData";
import AddProjectToCart from "./AddProjectToCart";
import UserProjects from "./UserProjects";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";
import PopoverStickOnClick from "./PopoverStickOnClick";
import NumberToPersianWord from "number_to_persian_word";

const baseURLGet = "https://api.atlaspood.ir/WebsiteSetting/GetBanner?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLMenu = "https://api.atlaspood.ir/WebsiteMenu/GetByChildren?apikey=477f46c6-4a17-4163-83cc-29908d";
const baseURLGetPage = "https://api.atlaspood.ir/WebsitePage/GetById";
const baseURLLogin = "https://api.atlaspood.ir/login";
const baseURLRegister = "https://api.atlaspood.ir/user/register";
const baseURLCheckEmail = "https://api.atlaspood.ir/user/UserNameIsAvailable";
const baseURLReset = "https://api.atlaspood.ir/user/SendResetPasswordEmail";
const baseURLGetCartCount = "https://api.atlaspood.ir/cart/GetCount";
const baseURLaddMulti = "https://api.atlaspood.ir/Cart/AddMultiple";


function Header() {
    const {t, i18n} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {isLoggedIn, user, showLogin, showLogin2, cartUpdated, mainCart} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [banner, setBanner] = React.useState([]);
    const [bannerOneSlide, setBannerOneSlide] = React.useState([]);
    const [bannerItem, setBannerItem] = React.useState({
        text1: "", text2: "", url: "/", nextI: 0
    });
    const [bannerItemOneSlide, setBannerItemOneSlide] = React.useState([]);
    const [langLocation, setLangLocation] = React.useState({
        locationEN: "/en", locationFA: "/fa"
    });
    const [menu, setMenu] = React.useState([]);
    const [catMenu, setCatMenu] = React.useState([]);
    const [menuRender, setMenuRender] = React.useState([]);
    const [modals, setModals] = useState([]);
    const [currentPage, setCurrentPage] = useState({
        level1: "",
        level2: "",
        level3: ""
    });
    
    const [cart, setCart] = useState({});
    const [draperyCount, setDraperyCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [swatchesCount, setSwatchesCount] = useState(0);
    
    const [cartCount, setCartCount] = useState(0);
    
    const [forgotEmail, setForgotEmail] = useState("");
    const [resetPage, setResetPage] = useState(false);
    
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
        remember: false
    });
    const [registerInfo, setRegisterInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirm: "",
        news: true
    });
    const [showRegister, setShowRegister] = useState(false);
    const [emailNotValid, setEmailNotValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMatchNotValid, setPasswordMatchNotValid] = useState(false);
    const [passwordNotValidState, setPasswordNotValidState] = useState(0);
    const [mobileErrorState, setMobileErrorState] = useState(0);
    const [emailErrorState, setEmailErrorState] = useState(0);
    const [passwordNotValid, setPasswordNotValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        count: false,
        lowercase: false,
        uppercase: false,
        numbers: false
    });
    const [firstNotExist, setFirstNotExist] = useState(false);
    const [lastNotExist, setLastNotExist] = useState(false);
    const [emailNotExist, setEmailNotExist] = useState(false);
    const [mobileNotExist, setMobileNotExist] = useState(false);
    
    const signIn = useRef(null);
    const fixedHeader = useRef(null);
    
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
    const [btn_disabled, setBtn_disabled] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");
    const [successText, setSuccessText] = React.useState("");
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
            return false;
        } else if (!/^0[0-9].*$/.test(user_number)) {
            // setMobileNotExist(true);
            setMobileErrorState(1);
            return false;
        } else {
            setMobileNotExist(false);
            return true;
        }
    }
    
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
    
    function registerUser() {
        
        if (passwordNotValidState === 0) {
            setPasswordNotValid(true);
        }
        
        if (!passwordMatch) {
            setPasswordMatchNotValid(true);
        }
        
        if (registerInfo.firstName.length === 0) {
            setFirstNotExist(true);
        }
        
        if (registerInfo.lastName.length === 0) {
            setLastNotExist(true);
        }
        if (registerInfo.phone === "") {
            setMobileNotExist(true);
        } else if (!validateNumber(registerInfo.phone)) {
            setMobileNotExist(true);
        } else {
            setMobileNotExist(false);
        }
        
        if (registerInfo.email.length === 0) {
            setEmailNotExist(true);
        } else if (!validateEmail(registerInfo.email)) {
            setEmailNotValid(true);
        } else {
            let promise1 = new Promise((resolve, reject) => {
                axios.get(baseURLCheckEmail, {
                    params: {
                        username: registerInfo.email
                    }
                }).then((response) => {
                    if (response.data) {
                        resolve();
                    } else {
                        setEmailErrorState(8);
                        setEmailNotValid(true);
                        reject();
                    }
                }).catch(err => {
                    console.log(err);
                    setEmailErrorState(7);
                    setEmailNotValid(true);
                    reject();
                });
            });
            promise1.then(() => {
                if (passwordMatch && passwordNotValidState === 1 && registerInfo.email.length !== 0 && registerInfo.lastName.length !== 0 && registerInfo.firstName.length !== 0 && (registerInfo.phone === "" || validateNumber(registerInfo.phone))) {
                    setBtn_disabled(true);
                    let tempPostObj = {};
                    tempPostObj["Email"] = registerInfo.email;
                    tempPostObj["Password"] = registerInfo.password;
                    tempPostObj["FirstName"] = registerInfo.firstName;
                    tempPostObj["LastName"] = registerInfo.lastName;
                    tempPostObj["Mobile"] = registerInfo.phone;
                    if (tempPostObj["Mobile"] === "") {
                        tempPostObj["Mobile"] = null;
                    }
                    axios.post(baseURLRegister, tempPostObj)
                        .then((response) => {
                            // setShowToast_register_ok(true);
                            // setSuccessText(t("verify_email_sent"));
                            window.scrollTo(0, 0);
                            setTimeout(() => {
                                loginUser(registerInfo.email, registerInfo.password, true);
                                setBtn_disabled(false);
                            }, 1000);
                        }).catch(err => {
                        console.log(err);
                        // setShowToast_register_fail(true);
                        setErrorText(t("Registration failed."));
                        window.scrollTo(0, 0);
                        setTimeout(() => {
                            setBtn_disabled(false);
                        }, 1000);
                    });
                }
            });
        }
    }
    
    function loginUser(email = loginInfo.email, password = loginInfo.password, isRegister) {
        setBtn_disabled(true);
        // let tempPostObj = {};
        // tempPostObj["username"] = loginInfo.email;
        // tempPostObj["password"] = loginInfo.password;
        // tempPostObj["grant_type"] = "password";
        signIn.current.innerHTML = t("Please wait");
        
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);
        formData.append("grant_type", "password");
        axios.post(baseURLLogin, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                
                // if (loginInfo.remember) {
                localStorage.setItem('user', JSON.stringify(response.data));
                // } else {
                //     let tempObj = response.data;
                //     delete tempObj["refresh_token"];
                //     localStorage.setItem('user', JSON.stringify(tempObj));
                // }
                // setShowToast_login_ok(true);
                setTimeout(() => {
                    if (isRegister) {
                        dispatch({
                            type: REGISTER,
                            payload: {user: response.data},
                        });
                    } else {
                        dispatch({
                            type: LOGIN,
                            payload: {user: response.data},
                        });
                    }
                    dispatch({
                        type: HideLoginModal,
                    })
                }, 3000);
                
            }).catch(err => {
            console.log(err);
            // setShowToast_login_fail(true);
            setErrorText(t("Invalid email or password."));
            setTimeout(() => {
                signIn.current.innerHTML = t("SIGN IN");
                setBtn_disabled(false);
            }, 1000);
        });
    }
    
    function sendResetPasswordRequest() {
        axios.post(baseURLReset, {}, {
            params: {
                userName: forgotEmail
            }
        }).then((response) => {
            setSuccessText(t("update_password_sent"));
        }).catch(err => {
            setErrorText(t("Invalid email for reset"));
        });
    }
    
    useEffect(() => {
        if (errorText !== "")
            setSuccessText("");
    }, [errorText]);
    
    useEffect(() => {
        if (successText !== "")
            setErrorText("");
    }, [successText]);
    
    useEffect(() => {
        if (emailNotExist)
            setEmailNotValid(false);
    }, [emailNotExist]);
    
    useEffect(() => {
        if (emailNotValid)
            setEmailNotExist(false);
    }, [emailNotValid]);
    
    
    const mega = useRef([]);
    
    
    function convertToPersian(string_farsi) {
        let tempString = string_farsi.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace('ك', 'ک');
        return tempString;
    }
    
    
    function getBanner() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            let temparr = [];
            arr.banner.forEach(obj => {
                if (obj["lang"] === location.pathname.split('').slice(1, 3).join('')) {
                    temparr = [...temparr, obj];
                }
            });
            if (temparr[0].oneSlide === "true") {
                setBannerOneSlide(temparr);
            } else
                setBanner(temparr);
        }).catch(err => {
            console.log(err);
        });
    }
    
    // function renderCatMenu() {
    //     let sortedMenu = [...menu];
    //     let promises = [];
    //     sortedMenu.forEach(obj => {
    //         let Children = obj.Children;
    //         Children.forEach(subObj => {
    //             let subChildren = subObj.Children;
    //             subChildren.forEach(subsubObj => {
    //                 let subSubWebsitePageId = subsubObj.WebsitePageId;
    //                 if (subSubWebsitePageId === null || subSubWebsitePageId === 0 || subSubWebsitePageId === undefined) {
    //                 } else {
    //                     promises.push(axios.get(baseURLGetPage, {
    //                             params: {
    //                                 WebsitePageId: subSubWebsitePageId,
    //                                 apiKey: window.$apikey
    //                             }
    //                         }).then((response) => {
    //                             subsubObj["subSubPageTypeId"] = response.data.PageTypeId;
    //                             subsubObj["subSubCategoryId"] = response.data.CategoryId;
    //                             // console.log("hi");
    //                         }).catch(err => {
    //                             console.log(err);
    //                         })
    //                     )
    //                 }
    //             });
    //         });
    //     });
    //     Promise.all(promises).then(() => {
    //         // console.log(sortedMenu);
    //         setCatMenu(sortedMenu);
    //     });
    //
    // }
    
    function renderBanner(bannerIndex) {
        if (bannerIndex === banner.length) bannerIndex = 0;
        let text1 = banner[bannerIndex].text1;
        let text2 = banner[bannerIndex].text2;
        let url = banner[bannerIndex].url;
        setBannerItem({text1: text1, text2: text2, url: url, nextI: bannerIndex + 1});
    }
    
    function renderBannerOneSlide() {
        const bannerList = [];
        for (let i = 0; i < bannerOneSlide.length; i++) {
            let text1 = bannerOneSlide[i].text1;
            let text2 = bannerOneSlide[i].text2;
            let url = bannerOneSlide[i].url;
            let fontSize = bannerOneSlide[i].fontSize;
            
            bannerList.push(
                <Link className="banner_oneSlide_item_container" key={"banner" + i} to={"/" + url} style={{fontSize: fontSize + "px"}}>
                    <div className={`banner_oneSlide_item ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <span>{text1}</span>&nbsp;
                        <span className="text_underline">{text2}</span>
                    </div>
                </Link>
            );
            if (i !== bannerOneSlide.length - 1)
                bannerList.push(
                    <span key={"banner_seperator" + i} className="banner_seperator">
                        &nbsp;|&nbsp;
                    </span>
                );
        }
        setBannerItemOneSlide(bannerList);
    }
    
    async function getMenu() {
        axios.get(baseURLMenu).then((response) => {
            let arr = response.data;
            setMenu(arr);
        }).catch(err => {
            console.log(err);
        });
    }
    
    function renderMenu() {
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        
        let sortedMenu = [];
        for (let i = 0; i < menu.length; i++) {
            sortedMenu[menu[i].MenuOrder] = menu[i];
        }
        
        
        for (let i = 0; i < sortedMenu.length; i++) {
            let Children = sortedMenu[i].Children;
            let tempArr = [];
            for (let j = 0; j < Children.length; j++) {
                tempArr[Children[j].MenuOrder] = Children[j];
            }
            sortedMenu[i].Children = tempArr;
        }
        
        
        for (let i = 0; i < sortedMenu.length; i++) {
            let Children = sortedMenu[i].Children;
            for (let j = 0; j < Children.length; j++) {
                let subChildren = Children[j].Children;
                let tempArr = [];
                for (let k = 0; k < subChildren.length; k++) {
                    tempArr[subChildren[k].MenuOrder] = subChildren[k];
                }
                sortedMenu[i].Children[j].Children = tempArr;
            }
        }
        
        // let sortedCatMenu=[...sortedMenu];
        // sortedMenu.forEach(obj => {
        //     let Children = obj.Children;
        //     Children.forEach(subObj => {
        //         let subChildren = subObj.Children;
        //         subChildren.forEach(subsubObj => {
        //             let subSubWebsitePageId = subsubObj.WebsitePageId;
        //             if (subSubWebsitePageId === null || subSubWebsitePageId === 0 || subSubWebsitePageId === undefined)
        //                 subSubWebsitePageId = 40;
        //             axios.get(baseURLGetPage, {
        //                 params: {
        //                     WebsitePageId: subSubWebsitePageId,
        //                     apiKey: window.$apikey
        //                 }
        //             }).then((response) => {
        //                 subsubObj["subSubPageTypeId"] = response.data.PageTypeId;
        //                 subsubObj["subSubCategoryId"] = response.data.CategoryId;
        //             }).catch(err => {
        //                 console.log(err);
        //             });
        //         });
        //     });
        // });
        //
        
        const menuList = [];
        for (let i = 0; i < sortedMenu.length; i++) {
            let MenuName = convertToPersian(sortedMenu[i].MenuName);
            let MenuEnName = sortedMenu[i].MenuEnName;
            let IsActive = sortedMenu[i].IsActive;
            let WebsitePageId = sortedMenu[i].WebsitePageId;
            let Children = sortedMenu[i].Children;
            
            const buffer = [];
            const subMenuList = [];
            for (let j = 0; j < Children.length; j++) {
                let subMenuName = convertToPersian(Children[j].MenuName);
                let subMenuEnName = Children[j].MenuEnName;
                let subIsActive = Children[j].IsActive;
                let subWebsitePageId = Children[j].WebsitePageId;
                let subChildren = Children[j].Children;
                let subWidth = Children[j].Width;
                
                if (subChildren.length === 0) {
                    buffer.push(
                        <h1 key={"subMenu" + i + j + "noChild" + "title"}
                            className="subMenu_title"
                            style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    );
                    //
                    // if (subChildren.length === 0) {
                    //     subMenuList.push(
                    //         <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + j}>
                    //             <h1 key={"subMenu" + i + j + "noChild" + "title"}
                    //                 className={`subMenu_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                    //                 style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    //         </div>
                    //     );
                    //
                } else {
                    
                    buffer.push(
                        <h1 key={"subMenu" + i + j + "title"}
                            className="subMenu_title"
                            style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    );
                    
                    let empty_fields = 0;
                    // console.log(subChildren.length,subMenuName,Children[j].WebsiteMenuId,subChildren);
                    for (let k = 0; k < subChildren.length; k++) {
                        let subSubMenuName = convertToPersian(subChildren[k].MenuName);
                        let subSubMenuEnName = subChildren[k].MenuEnName;
                        let subSubIsActive = subChildren[k].IsActive;
                        let subSubWebsitePageId = subChildren[k].WebsitePageId;
                        let subSubChildren = subChildren[k].Children;
                        let subSubWidth = subChildren[k].Width;
                        let subSubPageTypeId = subChildren[k].PageTypeId;
                        let subSubCategoryId = subChildren[k].PageName;
                        
                        
                        let subSubPageType = subSubPageTypeId === 5501 ? "Product" : "Curtain";
                        
                        
                        //
                        // if (k === 0) {
                        //     subSubMenuList.push(
                        //         <h1 key={"subMenu" + i + j + k + "title"}
                        //             className={`subMenu_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                        //             style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                        //     );
                        // }
                        
                        if (subSubMenuEnName === "") {
                            empty_fields++;
                        } else {
                            buffer.push(
                                <h2 key={"subSubMenu" + i + j + k}>
                                    <Link className="subSubMenu"
                                          to={"/" + pageLanguage + "/" + subSubPageType + "/" + subSubCategoryId}
                                          onClick={() => menuClicked(i)}>{pageLanguage === 'en' ? subSubMenuEnName : subSubMenuName}</Link>
                                </h2>);
                            
                            // subSubMenuList.push(
                            //     <h2 key={"subSubMenu" + i + j + k}>
                            //         <Link className={`subSubMenu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                            //               to={"/" + pageLanguage + "/" + subSubPageType + "/" + subSubCategoryId}>{pageLanguage === 'en' ? subSubMenuEnName : subSubMenuName}</Link>
                            //     </h2>);
                        }
                    }
                    for (let emptyCounter = 0; emptyCounter < empty_fields; emptyCounter++) {
                        buffer.push(
                            <h2 key={"subSubMenu" + i + j + "empty" + emptyCounter} className="emptySubMenu">
                                &nbsp;
                            </h2>);
                        
                        // subSubMenuList.push(
                        //     <h2 key={"subSubMenu" + i + j + "empty" + emptyCounter}>
                        //
                        //     </h2>);
                    }
                    
                    
                    // if (j + 1 < Children.length) {
                    //     if (subSubMenuList.length + (Children[j + 1].Children).length > 10) {
                    //         subMenuList.push(
                    //             <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + j}>
                    //                 {subSubMenuList}
                    //             </div>);
                    //         subSubMenuList = [];
                    //     }
                    // } else {
                    //     subMenuList.push(
                    //         <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + j}>
                    //             {subSubMenuList}
                    //         </div>);
                    //     subSubMenuList = [];
                    // }
                }
            }
            
            for (let m = 0; m < buffer.length; m += 13) {
                let subSubMenuList = [];
                for (let n = m; n < m + 13; n++) {
                    if (n === buffer.length)
                        break;
                    else {
                        subSubMenuList.push(buffer[n]);
                    }
                }
                subMenuList.push(
                    <div className="cel-top-menu" key={"subMenu" + i + m}>
                        {subSubMenuList}
                    </div>
                );
            }
            
            // console.log(buffer.length);
            
            
            menuList.push(
                <li key={"menu" + i}>
                    <h1>{pageLanguage === 'en' ? MenuEnName : MenuName}</h1>
                    <div ref={ref => (mega.current[i] = ref)} className="mega" style={{display: 'none'}}>
                        <div className="sub_menu">
                            {subMenuList}
                        </div>
                    </div>
                </li>);
        }
        setMenuRender(menuList);
    }
    
    function menuClicked(index) {
        if (mega.current[index])
            mega.current[index].className = "mega1";
        setTimeout(() => {
            if (mega.current[index])
                mega.current[index].className = "mega";
        }, 1000);
        // console.log(mega.current[index])
    }
    
    async function setLang() {
        const tempLocationEn = location.pathname.split('');
        tempLocationEn[1] = 'e';
        tempLocationEn[2] = 'n';
        tempLocationEn.join('');
        
        const tempLocationFa = location.pathname.split('');
        tempLocationFa[1] = 'f';
        tempLocationFa[2] = 'a';
        
        setLangLocation({locationEN: tempLocationEn.join(''), locationFA: tempLocationFa.join('')});
        
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }
    
    function modalHandleClose(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = false;
        setModals(tempModals);
    }
    
    function modalHandleShow(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = true;
        setModals(tempModals);
    }
    
    function getCartCount() {
        axios.get(baseURLGetCartCount, {
            headers: authHeader()
        }).then((response) => {
            setCartCount(response.data);
        }).catch(err => {
                                console.log(err);
                            if (err.response && err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        getCartCount();
                    } else {
                        setCartCount(0);
                    }
                });
            } else {
                setCartCount(0);
            }
        });
    }
    
    useEffect(() => {
        setLang().then(() => {
            if (pageLanguage !== '') {
                // setBannerItem({
                //     text1: "", text2: "", url: "/", nextI: 0
                // });
                // setBannerItemOneSlide([]);
                // setMenuRender([]);
                // setTimeout(() => {  console.log("World!"); }, 2000);
                // i18n.changeLanguage(pageLanguage);
                // getMenu().then(() => {
                //     getBanner();
                // });
            }
        });
        let currentPageInfo = JSON.parse(JSON.stringify(currentPage));
        currentPageInfo.level1 = location.pathname.split("/")[2];
        currentPageInfo.level2 = location.pathname.split("/")[3];
        currentPageInfo.level3 = location.pathname.split("/")[4];
        // console.log(currentPageInfo.level3);
        setCurrentPage(currentPageInfo);
        
        if (isLoggedIn) {
            getCartCount();
        } else {
            if (localStorage.getItem("cart") !== null) {
                setCart(JSON.parse(localStorage.getItem("cart")));
            } else {
                setCart(mainCart || {});
            }
            setCartCount(0);
        }
    }, [location.pathname]);
    
    useEffect(() => {
        setBannerItem({
            text1: "", text2: "", url: "/", nextI: 0
        });
        setBannerItemOneSlide([]);
        setMenuRender([]);
        if (pageLanguage !== '') {
            i18n.changeLanguage(pageLanguage);
            getMenu().then(() => {
                getBanner();
            });
            document.body.dir = pageLanguage === 'fa' ? "rtl" : "ltr";
            document.body.className = pageLanguage === 'fa' ? "font_farsi" : "font_en";
            // document.querySelectorAll("html  , body  , div  , span  , applet  , object  , iframe  , h1  , h2  , h3  , h4  , h5  , h6  , p  , blockquote  , pre  , a  , abbr  , acronym  , address  , big  , cite  , code  , del  , dfn  , em  , img  , ins  , kbd  , q  , s  , samp  , small  , strike  , strong  , sub  , sup  , tt  , var  , b  , u  , i  , center  , dl  , dt  , dd  , ol  , ul  , li  , fieldset  , form  , label  , legend  , table  , caption  , tbody  , tfoot  , thead  , tr  , th  , td  , article  , aside  , canvas  , details  , embed  , figure  , figcaption  , footer  , header  , hgroup  , menu  , nav  , output  , ruby  , section  , summary  , time  , mark  , audio  , video").forEach(obj => {
            //     if (pageLanguage === 'fa')
            //         obj.classList.add("font_farsi");
            //     else if (pageLanguage === 'en')
            //         obj.classList.remove("font_farsi");
            // });
        }
        
    }, [pageLanguage]);
    
    useEffect(() => {
        if (banner.length && pageLanguage !== '') {
            renderBanner(0)
        }
    }, [banner]);
    
    useEffect(() => {
        if (menu.length) {
            renderMenu()
        }
    }, [menu]);
    
    // useEffect(() => {
    //     if (catMenu.length) {
    //         renderMenu()
    //     }
    // }, [catMenu]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (bannerItem.text1.length) {
                renderBanner(bannerItem.nextI)
            }
        }, 4500);
        
        return () => clearTimeout(timeout)
        
    }, [bannerItem]);
    
    useEffect(() => {
        if (bannerOneSlide.length !== 0 && pageLanguage !== '') {
            renderBannerOneSlide();
            // console.log(bannerOneSlide)
        }
    }, [bannerOneSlide]);
    
    useEffect(() => {
        if (cartUpdated) {
            setCart(mainCart || {});
            setTimeout(() => {
                dispatch({
                    type: CartUpdatedFalse,
                });
            }, 500);
            // console.log(mainCart);
        }
    }, [cartUpdated]);
    
    useEffect(() => {
        if (Object.keys(cart).length !== 0) {
            if (isLoggedIn) {
                if (cart["CartDetails"]) {
                    let draperies = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6403;
                    });
                    
                    let swatches = cart["CartDetails"].filter((object1) => {
                        return object1["TypeId"] === 6402;
                    });
                    setDraperyCount(draperies.length);
                    setSwatchesCount(swatches.length);
                } else {
                    setDraperyCount(0);
                    setSwatchesCount(0);
                    setSwatchesCount(0);
                }
            } else {
                if (cart["drapery"] === undefined || cart["drapery"].length === 0) {
                    setDraperyCount(0);
                } else {
                    setDraperyCount(cart["drapery"].length);
                }
                if (cart["product"] === undefined || cart["product"] === []) {
                    setProductCount(0);
                } else {
                    setSwatchesCount(cart["swatches"].length);
                }
                if (cart["swatches"] === undefined || cart["swatches"] === []) {
                    setSwatchesCount(0);
                } else {
                    setSwatchesCount(cart["swatches"].length);
                }
            }
        } else {
            setDraperyCount(0);
            setSwatchesCount(0);
            setSwatchesCount(0);
        }
        setCartCount(0);
    }, [JSON.stringify(cart)]);
    
    useEffect(() => {
        
        if (isLoggedIn && showLogin2 && localStorage.getItem("cart") !== null && JSON.parse(localStorage.getItem("cart"))["drapery"] !== undefined && JSON.parse(localStorage.getItem("cart"))["drapery"].length > 0) {
            dispatch({
                type: HideLogin2Modal,
            });
            let tempDrapery = JSON.parse(localStorage.getItem("cart"))["drapery"];
            if (tempDrapery !== undefined) {
                let tempArr = [];
                let promiseArr = [];
                let tempDrapery2 = JSON.parse(JSON.stringify(tempDrapery));
                tempDrapery2.forEach((obj, index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        // setTimeout(function () {
                        GetUserProjectData(obj).then((temp) => {
                            let projectObj = obj["PreorderText"];
                            AddProjectToCart(temp, projectObj["SewingModelId"], projectObj["Price"], temp["ModelNameEn"], temp["ModelNameFa"], [temp["uploadedImagesFile"] ? temp["uploadedImagesFile"] : [], temp["uploadedImagesURL"] ? temp["uploadedImagesURL"] : [], temp["uploadedPDFFile"] ? temp["uploadedPDFFile"] : [], temp["uploadedPDFURL"] ? temp["uploadedPDFURL"] : []], projectObj["SewingOrderId"], undefined, navigate, true, temp["Accessories"][0], true).then((temp2) => {
                                tempArr.push({
                                    "TypeId": 6403,
                                    "Count": 1,
                                    "SewingOrder": temp2
                                });
                                resolve();
                            }).catch((err) => {
                                console.log(err);
                                resolve();
                            });
                        }).catch((err) => {
                            console.log(err);
                            resolve();
                        });
                        // }, index * 500);
                    })
                });
                
                Promise.all(promiseArr).then(() => {
                    axios.post(baseURLaddMulti, tempArr, {
                        headers: authHeader()
                    }).then((response) => {
                        let tempCart = response.data ? response.data : {};
                        setCart(response.data ? response.data : {});
                        localStorage.removeItem("cart");
                    }).catch(err => {
                                console.log(err);
                            if (err.response && err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                } else {
                                }
                            });
                        } else {
                            console.log("project not added to cart");
                        }
                    });
                });
            }
        }
        if (isLoggedIn && localStorage.getItem("cart") !== null && JSON.parse(localStorage.getItem("cart"))["drapery"] !== undefined && JSON.parse(localStorage.getItem("cart"))["drapery"].length > 0) {
            let tempDrapery = JSON.parse(localStorage.getItem("cart"))["drapery"];
            if (tempDrapery !== undefined) {
                let tempArr = [];
                let promiseArr = [];
                let tempDrapery2 = JSON.parse(JSON.stringify(tempDrapery));
                tempDrapery2.forEach((obj, index) => {
                    promiseArr[index] = new Promise((resolve, reject) => {
                        // setTimeout(function () {
                        GetUserProjectData(obj).then((temp) => {
                            let projectObj = obj["PreorderText"];
                            AddProjectToCart(temp, projectObj["SewingModelId"], projectObj["Price"], temp["ModelNameEn"], temp["ModelNameFa"], [temp["uploadedImagesFile"] ? temp["uploadedImagesFile"] : [], temp["uploadedImagesURL"] ? temp["uploadedImagesURL"] : [], temp["uploadedPDFFile"] ? temp["uploadedPDFFile"] : [], temp["uploadedPDFURL"] ? temp["uploadedPDFURL"] : []], projectObj["SewingOrderId"], undefined, navigate, true, temp["Accessories"][0], true).then((temp2) => {
                                tempArr.push({
                                    "TypeId": 6403,
                                    "Count": 1,
                                    "SewingOrder": temp2
                                });
                                resolve();
                            }).catch((err) => {
                                console.log(err);
                                resolve();
                            });
                        }).catch((err) => {
                            console.log(err);
                            resolve();
                        });
                        // }, index * 500);
                    })
                });
                
                Promise.all(promiseArr).then(() => {
                    axios.post(baseURLaddMulti, tempArr, {
                        headers: authHeader()
                    }).then((response) => {
                        let tempCart = response.data ? response.data : {};
                        setCart(response.data ? response.data : {});
                        localStorage.removeItem("cart");
                    }).catch(err => {
                                console.log(err);
                            if (err.response && err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                } else {
                                }
                            });
                        } else {
                            console.log("project not added to cart");
                        }
                    });
                });
            }
        }
    }, [isLoggedIn]);
    
    // const [offset2, setOffset2] = useState(0);
    // const [offset3, setOffset3] = useState(0);
    const [offset, setOffset] = useState(false);
    
    useEffect(() => {
        const onScroll = () => {
            // setOffset3(window.pageYOffset);
            // setOffset2(fixedHeader.current.offsetTop);
            if (fixedHeader.current.offsetTop + 180 < window.pageYOffset) {
                setOffset(true);
            } else {
                // if(offset && fixedHeader.current.offsetTop + 64 < window.pageYOffset){
                    setOffset(false);
                // }
            }
        };
        
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    
    return (
        <div className={`header_container padding-clear ${pageLanguage === 'fa' ? "font_farsi" : "font_en"} ${currentPage.level1 === "Checkout" ? "noDisplay" : ""}`} ref={fixedHeader}>
            <div>
                <div className={offset ? "fixed_header_top top_header" : "top_header"}>
                    <div className="col-lg-12">
                        <div className="top_title">
                            {bannerItemOneSlide.length === 0 &&
                                <Link to={"/" + bannerItem.url}>
                                    <span>{bannerItem.text1}</span>&nbsp;
                                    <span className="text_underline">{bannerItem.text2}</span>
                                </Link>
                            }
                            {bannerItemOneSlide.length !== 0 &&
                                bannerItemOneSlide
                            }
                        </div>
                    </div>
                </div>
                <div className={offset ? "fixed_header" : ""}>
                    <div>
                        <div className="mid_header">
                            <div className="col-lg-12">
                                <div className="mid_header_left">
                                    <div className="search-box">
                                        <button className="btn-search">
                                            <img src={require('../Images/public/main_search_icon.svg').default}
                                                 className="img-fluid" alt=""/>
                                            <input type="text" className={`input-search ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} placeholder={t("Search_placeholder")}
                                                   autoComplete="new-search"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="Logo"><Link to="/">{pageLanguage === 'en' ? <Logoen/> : <Logofa/>}</Link></div>
                                <div className="mid_header_right">
                                    <ul className={pageLanguage === 'fa' ? "float_left icons" : "float_right icons"}>
                                        {currentPage.level1 === "Curtain" && currentPage.level3 !== undefined &&
                                            <li className="login-open" onClick={() => {
                                                if (isLoggedIn) {
                                                    navigate("/" + pageLanguage + "/Account")
                                                } else {
                                                    dispatch({
                                                        type: ShowLoginModal,
                                                    })
                                                }
                                            }}>
                                                <Person/>
                                            </li>
                                        }
                                        {!(currentPage.level1 === "Curtain" && currentPage.level3 !== undefined) &&
                                            <Link className="login-open" to={isLoggedIn ? "/" + pageLanguage + "/Account" : "/" + pageLanguage + "/User/NewUser"}><Person/></Link>
                                        }
                                        <li className="favorite">
                                            <a href="https://www.doopsalta.com/en/account/login/">
                                                <Favorite/>
                                            </a>
                                        </li>
                                        {(cartCount > 0 || (draperyCount + productCount + swatchesCount > 0)) &&
                                            <li className="checkout">
                                                <div onClick={() => {
                                                    navigate("/" + pageLanguage + "/Basket");
                                                }}>
                                                    <div className="display_grid">
                                                        <Basket/>
                                                        <div
                                                            className="count">{pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${cartCount > 0 ? cartCount : draperyCount + productCount + swatchesCount}`) : cartCount > 0 ? cartCount : draperyCount + productCount + swatchesCount}</div>
                                                    </div>
                                                </div>
                                                {/*<div className="card_menu">*/}
                                                {/*    <div className="card_menu_title">*/}
                                                {/*        <span>Shopping Bag</span>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </li>
                                        }
                                        {cartCount === 0 && (draperyCount + productCount + swatchesCount === 0) &&
                                            <li className="checkout">
                                                <div>
                                                    <PopoverStickOnClick btnClassNames="Header_Basket_icon"
                                                                         classNames={isLoggedIn ? "Header_Basket_icon_popover Header_Basket_icon_popover2" : "Header_Basket_icon_popover"}
                                                                         placement="bottom"
                                                                         isHover={false}
                                                                         onMouseEnter={() => {
                                                                         }}
                                                                         children={<div className="display_grid">
                                                                             <Basket/>
                                                                             <div
                                                                                 className="count">{cartCount > 0 ? cartCount : draperyCount + productCount + swatchesCount}</div>
                                                                         </div>}
                                                                         component={
                                                                             <div className="card_menu_title">
                                                                                 <div className="basket_empty_header_1">{t("basket_empty_header_1")}</div>
                                                                                 {!isLoggedIn && <div className="basket_empty_header_2">{t("basket_empty_header_2")}<span
                                                                                     className="text_underline header_basket_sign_in"
                                                                                     onClick={() => navigate("/" + pageLanguage + "/User")}>{t("basket_empty_header_3")}</span>{t("basket_empty_header_4")}
                                                                                 </div>}
                                                                             </div>
                                                                         }/>
                                                
                                                </div>
                                                {/*<div className="card_menu">*/}
                                                {/*    <div className="card_menu_title">*/}
                                                {/*        <span>Shopping Bag</span>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </li>
                                        }
                                    </ul>
                                    <ul className={`Lang_change_container ${pageLanguage === 'fa' ? "float_left" : "float_right"}`}>
                                        <li className="Lang_change">
                                            <Link to={langLocation.locationEN} onClick={() => i18n.changeLanguage("en")}
                                                  style={pageLanguage === 'en' ? {pointerEvents: "none", color: "#383838"} : null}>ENGLISH</Link>
                                        </li>
                                        <li className="lang_separator">&nbsp;|&nbsp;</li>
                                        <li className="Lang_change">
                                            <Link to={langLocation.locationFA} onClick={() => i18n.changeLanguage("fa")}
                                                  style={pageLanguage === 'fa' ? {pointerEvents: "none", color: "#383838"} : null}>فارسی</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bottom_header">
                            <div className="col-lg-12">
                                <div className="menu">
                                    <ul>
                                        {menuRender}
                                    </ul>
                                    <div className="bghover">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Modals */}
                
                <Modal backdrop="static" keyboard={false} dialogClassName={`login_modal fullSizeModal login_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                       show={showLogin}
                       onHide={() => dispatch({
                           type: HideLoginModal,
                       })}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="logo_container">
                            <div className="Logo">
                                <Link to="/">{pageLanguage === 'en' ? <Logoen/> : <Logofa/>}</Link>
                            </div>
                        </div>
                        {!resetPage && errorText !== "" &&
                            <div className="login_page_error_text">{errorText}</div>
                        }
                        {!resetPage && successText !== "" &&
                            <div className="login_page_success_text">{successText}</div>
                        }
                        {!resetPage &&
                            <div className="login_register_container">
                                <div className="login_container">
                                    <div className="login_inside_container">
                                        <h1 className="login_title">{t("SIGN IN TO YOUR ACCOUNT")}</h1>
                                        <input type="text" placeholder={t("Email*")} className="form-control" name="Email" value={loginInfo.email}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(loginInfo));
                                                   temp.email = e.target.value;
                                                   setLoginInfo(temp);
                                               }}/>
                                        <input type="password" placeholder={t("Password*")} className="form-control form-control-password" name="Password"
                                               value={loginInfo.password}
                                               autoComplete="new-password"
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(loginInfo));
                                                   temp.password = e.target.value;
                                                   setLoginInfo(temp);
                                               }}/>
                                        <div className="remember_forgot_container">
                                            <div className="remember_container">
                                                {/*<label className="remember_label">*/}
                                                {/*    <input type="checkbox" value={loginInfo.remember}*/}
                                                {/*           onChange={(e) => {*/}
                                                {/*               let temp = JSON.parse(JSON.stringify(loginInfo));*/}
                                                {/*               temp.remember = e.target.value;*/}
                                                {/*               setLoginInfo(temp);*/}
                                                {/*           }}/>*/}
                                                {/*    {t("Remember Me")}*/}
                                                {/*</label>*/}
                                            </div>
                                            <div className="forgot text_underline" onClick={() => setResetPage(true)}>{t("Forgot your password?")}</div>
                                        </div>
                                        <div className="login_btn_container">
                                            {/*<button className="login_btn btn btn-new-dark">SIGN IN</button>*/}
                                            <button className="login_btn btn btn-new-dark" onClick={() => loginUser()} disabled={btn_disabled} ref={signIn}>{t("SIGN IN")}</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="register_container">
                                    <div className="register_inside_container">
                                        <h1 className="login_title">{t("CREATE AN ACCOUNT")}</h1>
                                        <p className="login_text">{t("register_list_title")}</p>
                                        <ul className="register_list">
                                            <li className="register_list_item">{t("register_list_item0")}</li>
                                            <li className="register_list_item">{t("register_list_item1")}</li>
                                            <li className="register_list_item">{t("register_list_item2")}</li>
                                            <li className="register_list_item">{t("register_list_item3")}</li>
                                        </ul>
                                        {!showRegister && <button className="register_btn btn" onClick={() => setShowRegister(true)}>{t("LET'S GO")}</button>}
                                        {showRegister && <div className="register_section_container">
                                            <div className="register_section_item">
                                                <input type="text" placeholder={t("First Name*")} className={"form-control " + (firstNotExist ? "password_not_valid" : "")}
                                                       name="name"
                                                       value={registerInfo.firstName}
                                                       onChange={(e) => {
                                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                                           temp.firstName = e.target.value;
                                                           setRegisterInfo(temp);
                                                           if (e.target.value.length > 0) {
                                                               setFirstNotExist(false);
                                                           }
                                                       }}/>
                                                {firstNotExist && <div className="input_not_valid">{t("First Name Required.")}</div>}
                                            </div>
                                            <div className="register_section_item">
                                                <input type="text" placeholder={t("Last Name*")} className={"form-control " + (lastNotExist ? "password_not_valid" : "")}
                                                       name="lastName"
                                                       value={registerInfo.lastName}
                                                       onChange={(e) => {
                                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                                           temp.lastName = e.target.value;
                                                           setRegisterInfo(temp);
                                                           if (e.target.value.length > 0) {
                                                               setLastNotExist(false);
                                                           }
                                                       }}/>
                                                {lastNotExist && <div className="input_not_valid">{t("Last Name Required.")}</div>}
                                            </div>
                                            <div className="register_section_item">
                                                <input type="email" placeholder={t("Email*")}
                                                       className={"form-control " + (emailNotValid || emailNotExist ? "password_not_valid" : "")}
                                                       name="Email"
                                                       value={registerInfo.email}
                                                       onChange={(e) => {
                                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                                           temp.email = e.target.value;
                                                           setRegisterInfo(temp);
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
                                            <div className="register_section_item">
                                                <input type="text" placeholder={t("Mobile Number (Optional)")}
                                                       className={"form-control " + (mobileNotExist ? "password_not_valid" : "")}
                                                       name="mobile" value={registerInfo.phone}
                                                       onChange={(e) => {
                                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                                           temp.phone = e.target.value.replace(/\D/g, '').replace(/[^0-9]/g, "");
                                                           setRegisterInfo(temp);
                                                           validateNumber(e.target.value.toString());
                                                       }}/>
                                                {mobileNotExist && <div className="input_not_valid">{mobileError[pageLanguage][mobileErrorState]["error"]}</div>}
                                            </div>
                                            <div className="register_section_item">
                                                <input type="password" placeholder={t("Password*")}
                                                       className={"form-control form-control-password " + (passwordNotValid ? "password_not_valid" : "")}
                                                       name="Register_Password"
                                                       value={registerInfo.password}
                                                       autoComplete="new-password"
                                                       onChange={(e) => {
                                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                                           temp.password = e.target.value.replace(/\s/g, '');
                                                           // temp.password = temp.password.replace(/[^0-9A-Za-z\s]/g, '');
                                                           setRegisterInfo(temp);
                                                           if (temp.password === temp.passwordConfirm) {
                                                               setPasswordMatch(true);
                                                               setPasswordMatchNotValid(false);
                                                           } else
                                                               setPasswordMatch(false);
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
                                                {/*<div className={"password_details " + passwordNotValidTextClass}>Minimum length of this field must be equal or greater than 8 characters and less or*/}
                                                {/*    equal than 20 characters. There must be minimum one letter and one number character. Any spaces*/}
                                                {/*    will be ignored.*/}
                                                {/*</div>*/}
                                            </div>
                                            <div className="register_section_item">
                                                <input type="password" placeholder={t("Confirm Password*")}
                                                       className={"form-control form-control-password " + (passwordMatchNotValid ? "password_not_valid" : "")}
                                                       name="Register_PasswordConfirm"
                                                       value={registerInfo.passwordConfirm}
                                                       autoComplete="new-password"
                                                       onChange={(e) => {
                                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                                           temp.passwordConfirm = e.target.value;
                                                           setRegisterInfo(temp);
                                                           if (temp.password === temp.passwordConfirm) {
                                                               setPasswordMatch(true);
                                                               setPasswordMatchNotValid(false);
                                                           } else
                                                               setPasswordMatch(false);
                                                       }}/>
                                                {passwordMatchNotValid && <div className="input_not_valid">{t("Password confirmation is required.")}
                                                </div>}
                                            </div>
                                            <div className="news_signup">
                                                <div className="checkbox_style">
                                                    <input type="checkbox" checked={registerInfo.news}
                                                           onChange={(e) => {
                                                               let temp = JSON.parse(JSON.stringify(registerInfo));
                                                               temp.news = e.target.checked;
                                                               setRegisterInfo(temp);
                                                           }} id="registerInfonews"/>
                                                    <label htmlFor="registerInfonews" className="checkbox_label">
                                                        <img className="checkbox_label_img checkmark1 img-fluid" src={require('../Images/public/checkmark1_checkbox.png')}
                                                             alt=""/>
                                                    </label>
                                                    <span className="checkbox_text">
                                                {t("signup to email")}
                                            </span>
                                                </div>
                                            </div>
                                            <div className="login_btn_container">
                                                <button className="login_btn btn btn-new-dark" onClick={() => registerUser()}
                                                        disabled={btn_disabled}>{t("CREATE AN ACCOUNT")}</button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        
                        {resetPage &&
                            <div className="Forgot_page_container login_register_container">
                                <div className="login_container">
                                    <div className="login_inside_container">
                                        <h1 className="login_title">{t("Forgot Password")}</h1>
                                        <h2 className="forget_text forget_text_small">{t("forgot_page_text")}</h2>
                                        <input type="text" placeholder={t("Email*")} className="form-control" name="Email" value={forgotEmail}
                                               onChange={(e) => {
                                                   setForgotEmail(e.target.value);
                                               }}/>
                                        
                                        <div className="login_btn_container">
                                            {/*<button className="login_btn btn btn-new-dark">SIGN IN</button>*/}
                                            <button className="login_btn btn btn-new-dark" onClick={() => {
                                                sendResetPasswordRequest();
                                                setResetPage(false);
                                            }}>{t("SUBMIT")}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </Modal.Body>
                </Modal>
                
                
                <Modal backdrop="static" keyboard={false}
                       className={`cart_modal_container cart_agree_container add_to_project_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                       dialogClassName={`cart_modal ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                       show={showLogin2}
                       onHide={() => dispatch({
                           type: HideLogin2Modal,
                       })} id="add_to_project_modal">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <ModalLogin/>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    
    
    );
}

export default Header;
