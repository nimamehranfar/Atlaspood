import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import axios from "axios";
import {Toast, ToastContainer} from "react-bootstrap";
import {LOGIN, REGISTER} from "../Actions/types";
import {useDispatch} from "react-redux";
import {removeNodeAtPath} from "@nosferatu500/react-sortable-tree";

const baseUrl = "https://api.atlaspood.ir/user/Activate";
const baseURLLogin = "https://api.atlaspood.ir/login";
const baseURLRegister = "https://api.atlaspood.ir/user/register";
const baseURLCheckEmail = "https://api.atlaspood.ir/user/UserNameIsAvailable";
const baseURLReset = "https://api.atlaspood.ir/user/SendResetPasswordEmail";


function RegisterLogin() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {activeId} = useParams();
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
    
    const [showOverlay, setShowOverlay] = useState(false);
    const signIn = useRef(null);
    
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
    
    // const [showToast_register_ok, setShowToast_register_ok] = React.useState(false);
    // const [showToast_login_ok, setShowToast_login_ok] = React.useState(false);
    // const [showToast_register_fail, setShowToast_register_fail] = React.useState(false);
    // const [showToast_login_fail, setShowToast_login_fail] = React.useState(false);
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
        signIn.current.innerHTML=t("Please wait");
        
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
                }, 3000);
                
            }).catch(err => {
            console.log(err);
            // setShowToast_login_fail(true);
            setErrorText(t("Invalid email or password."));
            setTimeout(() => {
                signIn.current.innerHTML=t("SIGN IN");
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
    
    function verifyEmail() {
        axios.post(baseUrl, {}, {
            params: {
                ActivationCode: activeId
            }
        }).then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccessText("Your email verified, Redirecting ...");
            setTimeout(() => {
                dispatch({
                    type: LOGIN,
                    payload: {user: response.data},
                });
                navigate("/" + pageLanguage + "/Account");
            }, 2000);
        }).catch(err => {
            console.log(err);
            setSuccessText("Invalid Activation code, Redirecting ...");
            setTimeout(() => {
                navigate("/" + pageLanguage + "/User");
                setBtn_disabled(false);
                setSuccessText("");
                setShowOverlay(false);
            }, 2000);
        });
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        if (activeId !== undefined) {
            setShowOverlay(true);
            setBtn_disabled(true);
            setSuccessText("Verifying your email ...");
            verifyEmail();
        }
    }, [location.pathname]);
    
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
    
    return (
        <div className={`login_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            {showOverlay && <div className="invisible_overlay">&nbsp;</div>}
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
                        <input type="password" placeholder={t("Password*")} className="form-control form-control-password" name="Password" value={loginInfo.password}
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
                                <input type="text" placeholder={t("First Name*")} className={"form-control " + (firstNotExist ? "password_not_valid" : "")} name="name"
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
                                <input type="text" placeholder={t("Last Name*")} className={"form-control " + (lastNotExist ? "password_not_valid" : "")} name="lastName"
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
                                <input type="email" placeholder={t("Email*")} className={"form-control " + (emailNotValid || emailNotExist ? "password_not_valid" : "")}
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
                                <input type="text" placeholder={t("Mobile Number (Optional)")} className={"form-control " + (mobileNotExist ? "password_not_valid" : "")}
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
                                       className={"form-control form-control-password " + (passwordMatchNotValid ? "password_not_valid" : "")} name="Register_PasswordConfirm"
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
                                {/*<label className="news_signup_label">*/}
                                {/*    <input type="checkbox" checked={registerInfo.news}*/}
                                {/*           onChange={(e) => {*/}
                                {/*               let temp = JSON.parse(JSON.stringify(registerInfo));*/}
                                {/*               temp.news = e.target.checked;*/}
                                {/*               setRegisterInfo(temp);*/}
                                {/*           }}/>*/}
                                {/*</label>*/}
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
                                    <span className="checkbox_text news_signup_label">
                                    {t("signup to email")}
                                    </span>
                                </div>
                            </div>
                            <div className="login_btn_container">
                                <button className="login_btn btn btn-new-dark" onClick={() => registerUser()} disabled={btn_disabled}>{t("CREATE AN ACCOUNT")}</button>
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
            {/*<ToastContainer className="p-3 position_fixed" position="top-start">*/}
            {/*    <Toast onClose={() => setShowToast_register_ok(false)} bg="success" show={showToast_register_ok} delay={3000} autohide>*/}
            {/*        <Toast.Header>*/}
            {/*            <img className="rounded me-2"/>*/}
            {/*            <strong className="me-auto">Success</strong>*/}
            {/*            /!*<small>couple of seconds ago</small>*!/*/}
            {/*        </Toast.Header>*/}
            {/*        <Toast.Body>Register was successful. Logging in a few seconds...</Toast.Body>*/}
            {/*    </Toast>*/}
            {/*</ToastContainer>*/}
            {/*<ToastContainer className="p-3 position_fixed" position="top-start">*/}
            {/*    <Toast onClose={() => setShowToast_login_ok(false)} bg="success" show={showToast_login_ok} delay={3000} autohide>*/}
            {/*        <Toast.Header>*/}
            {/*            <img className="rounded me-2"/>*/}
            {/*            <strong className="me-auto">Success</strong>*/}
            {/*            /!*<small>couple of seconds ago</small>*!/*/}
            {/*        </Toast.Header>*/}
            {/*        <Toast.Body>Login was successful.</Toast.Body>*/}
            {/*    </Toast>*/}
            {/*</ToastContainer>*/}
            
            {/*<ToastContainer className="p-3 position_fixed" position="top-start">*/}
            {/*    <Toast onClose={() => setShowToast_register_fail(false)} bg="danger" show={showToast_register_fail} delay={3000} autohide>*/}
            {/*        <Toast.Header>*/}
            {/*            <img className="rounded me-2"/>*/}
            {/*            <strong className="me-auto">Failure</strong>*/}
            {/*            /!*<small>couple of seconds ago</small>*!/*/}
            {/*        </Toast.Header>*/}
            {/*        <Toast.Body>Registration failed.</Toast.Body>*/}
            {/*    </Toast>*/}
            {/*</ToastContainer>*/}
            {/*<ToastContainer className="p-3 position_fixed" position="top-start">*/}
            {/*    <Toast onClose={() => setShowToast_login_fail(false)} bg="danger" show={showToast_login_fail} delay={3000} autohide>*/}
            {/*        <Toast.Header>*/}
            {/*            <img className="rounded me-2"/>*/}
            {/*            <strong className="me-auto">Failure</strong>*/}
            {/*            /!*<small>couple of seconds ago</small>*!/*/}
            {/*        </Toast.Header>*/}
            {/*        <Toast.Body>Login failed.</Toast.Body>*/}
            {/*    </Toast>*/}
            {/*</ToastContainer>*/}
        
        </div>
    
    );
}

export default RegisterLogin;