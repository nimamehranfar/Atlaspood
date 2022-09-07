import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";


const baseURLCheckResetPassword = "https://api.atlaspood.ir/user/CheckResetPassword";
const baseURLResetPassword = "https://api.atlaspood.ir/user/ResetPassword";

function Reset() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const {emailId} = useParams();
    const {resetId} = useParams();
    
    const [registerInfo, setRegisterInfo] = useState({
        email: "",
        password: "",
        passwordConfirm: ""
    });
    
    const [resetCode, setResetCode] = useState(resetId);
    const [userEmail, setUserEmail] = useState(emailId);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMatchNotValid, setPasswordMatchNotValid] = useState(false);
    const [passwordNotValidState, setPasswordNotValidState] = useState(0);
    const [passwordNotValid, setPasswordNotValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        count: false,
        lowercase: false,
        uppercase: false,
        numbers: false
    });
    
    function checkPasswordStrength(user_password) {
        let temp = JSON.parse(JSON.stringify(passwordValidation));
        if (user_password.length > 20) {
            setPasswordNotValidState(0);
        } else if (user_password.length < 6) {
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
        
        temp.count = user_password.length <= 20 && user_password.length >= 6;
        
        temp.uppercase = new RegExp("[A-Z]").test(user_password);
        
        temp.lowercase = new RegExp("[a-z]").test(user_password);
        
        temp.numbers = new RegExp("[0-9]").test(user_password);
        
        setPasswordValidation(temp);
    }
    
    function ResetPassword() {
        if (passwordNotValidState === 0) {
            setPasswordNotValid(true);
        } else if (!passwordMatch) {
            setPasswordMatchNotValid(true);
        } else {
            axios.post(baseURLResetPassword, {}, {
                params: {
                    resetCode: resetCode,
                    password: registerInfo.password
                }
            }).then((response) => {
                navigate("/" + pageLanguage + "/User");
            }).catch(err => {
                navigate("/" + pageLanguage + "/User");
            });
        }
        
    }
    
    function checkResetCode() {
        axios.post(baseURLCheckResetPassword, {}, {
            params: {
                resetCode: resetCode
            }
        }).then((response) => {
        }).catch(err => {
            navigate("/" + pageLanguage + "/User");
        });
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        checkResetCode();
    }, [location.pathname]);
    
    return (
        <div className={`login_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="Forgot_page_container login_register_container">
                <div className="login_container">
                    <div className="login_inside_container">
                        <h1 className="login_title">{t("RESET ACCOUNT PASSWORD")}</h1>
                        <h2 className="forget_text">{t("Enter a new password for")} {userEmail} {t("Enter a new password for2")}</h2>
                        <form>
                            <input type="email" hidden/>
                            <div className="register_section_item">
                                <input type="password" placeholder={t("Password*")} autoComplete="new-password"
                                       className={"form-control form-control-password " + (passwordNotValid ? "password_not_valid" : "")}
                                       name="Register_Password"
                                       value={registerInfo.password}
                                       onChange={(e) => {
                                           let temp = JSON.parse(JSON.stringify(registerInfo));
                                           temp.password = e.target.value.replace(/\s/g, '');
                                           temp.password = temp.password.replace(/[^0-9A-Za-z\s]/g, '');
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
                                            {passwordValidation.count&&
                                            <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text1")}
                                            </span>
                                        </li>
                                        <li className={"input_not_valid_password_item " + (passwordValidation.lowercase ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.lowercase&&
                                            <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text2")}
                                            </span>
                                        </li>
                                        <li className={"input_not_valid_password_item " + (passwordValidation.uppercase ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.uppercase&&
                                            <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text3")}
                                            </span>
                                        </li>
                                        <li className={"input_not_valid_password_item " + (passwordValidation.numbers ? "input_not_valid_password_item_check" : "")}>
                                            <span>
                                            {passwordValidation.numbers&&
                                            <img className="checkmark1 img-fluid" src={require('../Images/public/checkmark1.png')} alt=""/>
                                            }
                                                {t("password_required_text4")}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                }
                            </div>
                            <div className="register_section_item register_section_item_reset">
                                <input type="password" placeholder={t("Confirm Password*")} autoComplete="new-password"
                                       className={"form-control form-control-password " + (passwordMatchNotValid ? "password_not_valid" : "")} name="Register_PasswordConfirm"
                                       value={registerInfo.passwordConfirm}
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
                            <div className="login_btn_container">
                                <button className="login_btn btn btn-new-dark reset_acc_btn" onClick={() => {
                                    ResetPassword()
                                }}>{t("RESET PASSWORD")}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reset;