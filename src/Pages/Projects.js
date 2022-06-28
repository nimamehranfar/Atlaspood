import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {func} from "prop-types";
import axios from "axios";
import NumberToPersianWord from "number_to_persian_word";
import GetPrice from "../Components/GetPrice";
import authHeader from "../Services/auth-header";
import UserProjects from "../Components/UserProjects";
import CartInfo from "../Components/CartInfo";
import {refreshToken} from "../Services/auth.service";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useDispatch} from "react-redux";

const baseURLGetProjects = "http://api.atlaspood.ir/SewingPreorder/GetAll";
const baseURLEditProject = "http://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLDeleteProject = "http://api.atlaspood.ir/SewingPreorder/Delete";


function Projects() {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    let navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [userProjects, setUserProjects] = useState([]);
    const [userProjectsRender, setUserProjectsRender] = useState([<h1 key={1} className="no_project">You don't have any saved project yet.</h1>]);
    
    function getUserProjects() {
        axios.get(baseURLGetProjects, {
            headers: authHeader()
        }).then((response) => {
            setUserProjects(response.data);
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        localStorage.setItem('user', JSON.stringify(response2.data));
                        dispatch({
                            type: LOGIN,
                            payload: {user: response2.data},
                        });
                        getUserProjects();
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
    
    function renderUserProjects() {
        let projectData = JSON.parse(JSON.stringify(UserProjects));
        let tempProjectArr = [];
        let promise2 = new Promise((resolve, reject) => {
            for (let i = 0; i < userProjects.length; i++) {
                let projectDataObj = projectData[userProjects[i]["SewingModelId"]];
                let tempArr = [];
                let projectId = userProjects[i]["SewingPreorderId"];
                
                if (projectDataObj) {
                    let promise1 = new Promise((resolve, reject) => {
                        projectDataObj["data"].forEach((tempObj, index) => {
                            if (tempObj["title"] !== "" && tempObj["lang"].indexOf(pageLanguage) > -1) {
                                let objLabel = "";
                                if (userProjects[i]["PreorderText"][tempObj["apiLabel"]] === undefined) {
                                } else {
                                    let apiValue = userProjects[i]["PreorderText"][tempObj["apiLabel"]] === null ? "null" : userProjects[i]["PreorderText"][tempObj["apiLabel"]].toString();
                                    if (tempObj["titleValue"] === null) {
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
                                    tempArr[tempObj["order"]] =
                                        <div className="basket_item_title_desc" key={index}>
                                            <h3>{t(tempObj["title"])}&nbsp;</h3>
                                            <h4>{objLabel}</h4>
                                        </div>;
                                }
                                
                                if (index === projectDataObj["data"].length - 1) {
                                    resolve();
                                }
                            } else {
                                resolve();
                            }
                            
                        });
                    });
                    
                    promise1.then(() => {
                        tempProjectArr[i] =
                            <li className="drapery_basket_item" key={i}>
                            <span className="basket_item_title">
                                 <div className="basket_item_image_container">
                                    <img src="http://api.atlaspood.ir/Content/Images/Product/2021/2021-11-17/90909302/90909302_0303.jpg" alt="" className="basket_item_img"/>
                                 </div>
                                <div className="basket_item_title_container">
                                <div
                                    className="basket_item_title_name">{pageLanguage === "fa" ? userProjects[i]["PreorderText"]["ModelNameFa"] + " سفارشی " : "Custom " + userProjects[i]["PreorderText"]["ModelNameEn"]}</div>
                                    {tempArr}
                                </div>
                            </span>
                                <span className="basket_item_price">{userProjects[i]["IsCompleted"]? GetPrice(userProjects[i]["PreorderText"]["price"], pageLanguage, t("TOMANS")):"---"}</span>
                                <span className="basket_item_qty">
                            <div className="basket_item_qty_numbers">
                                   <button type="text" className="basket_qty_minus" onClick={() => setProjectCount(projectId, 0, 0, -1)}>
                                      <img src={require('../Images/public/minus.svg').default} alt="" className="qty_math_icon"/>
                                   </button>
                                   <input type="text" className="basket_qty_num"
                                          value={pageLanguage === "fa" ? NumberToPersianWord.convertEnToPe(`${userProjects[i]["Count"]}`) : userProjects[i]["Count"]}
                                          onChange={(e) => setProjectCount(projectId, NumberToPersianWord.convertPeToEn(`${e.target.value}`), 0)}/>
                                   <button type="text" className="basket_qty_plus" onClick={() => setProjectCount(projectId, 0, 0, 1)}>
                                       <img src={require('../Images/public/plus.svg').default} alt="" className="qty_math_icon"/>
                                   </button>
                                </div>
                                <div className="basket_item_qty_button">
                                <button className="basket_button basket_button_remove" onClick={() => setProjectCount(projectId, 0, 0)}>{t("X REMOVE")}</button>
                                </div>
                            </span>
                                <span className="basket_item_total">{userProjects[i]["IsCompleted"]? GetPrice(userProjects[i]["PreorderText"]["price"]*userProjects[i]["Count"], pageLanguage, t("TOMANS")):"---"}</span>
                                
                                <span className="basket_item_hidden1"/>
                                {!userProjects[i]["IsCompleted"] &&
                                <span className="basket_item_btn">
                                        <button className="projects_add_to_cart_btn btn projects_add_to_cart_btn_long">{t("FINISH CONFIGURING")}</button>
                                </span>
                                }
                                {userProjects[i]["IsCompleted"] &&
                                <span className="basket_item_btn">
                                        <button className="projects_add_to_cart_btn btn">{t("ADD TO BAG")}</button>
                                        <Link className="projects_edit_btn btn" to={"/" + pageLanguage + "/Curtain/Zebra-Shades/0303"}>{t("EDIT")}</Link>
                                </span>
                                }
                                <span className="basket_item_hidden2"/>
                            </li>;
                        if (i === userProjects.length - 1) {
                            resolve();
                        }
                    });
                }
            }
        });
        promise2.then(() => {
            setUserProjectsRender(tempProjectArr);
        });
        
    }
    
    function setProjectCount(projectId, numValue, type, minusPlus) {
        let temp = JSON.parse(JSON.stringify(userProjects));
        
        let tempProject = temp.find(opt => opt["SewingPreorderId"] === projectId);
        
        if (tempProject !== {}) {
            if (minusPlus !== undefined) {
                if (tempProject["Count"] + minusPlus <= 0 || tempProject["Count"] + minusPlus > 10)
                    setProjectCount(projectId, tempProject["Count"] + minusPlus, type);
                else {
                    tempProject["Count"] = tempProject["Count"] + minusPlus;
                    editProject(tempProject);
                }
            } else {
                if (numValue === "") {
                    tempProject["Count"] = 1;
                    editProject(tempProject);
                } else if (!isNaN(numValue) || numValue === 10 || numValue === "10") {
                    if (parseInt(numValue) > 10) {
                        tempProject["Count"] = 10;
                        editProject(tempProject);
                        
                    } else if (parseInt(numValue) <= 0) {
                        deleteUserProject(projectId);
                    } else {
                        tempProject["Count"] = parseInt(numValue);
                        editProject(tempProject);
                    }
                }
            }
        }
    }
    
    function editProject(projectObj) {
        axios.post(baseURLEditProject, projectObj, {
            headers: authHeader()
        })
            .then(() => {
                getUserProjects();
            }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        localStorage.setItem('user', JSON.stringify(response2.data));
                        dispatch({
                            type: LOGIN,
                            payload: {user: response2.data},
                        });
                        editProject(projectObj);
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
    
    function deleteUserProject(projectId) {
        axios.delete(baseURLDeleteProject, {
            params: {
                id: projectId
            },
            headers:authHeader()
        }).then((response) => {
            getUserProjects();
        }).catch(err => {
            if (err.response.status === 401) {
                refreshToken().then((response2) => {
                    if (response2 !== false) {
                        localStorage.setItem('user', JSON.stringify(response2.data));
                        dispatch({
                            type: LOGIN,
                            payload: {user: response2.data},
                        });
                        deleteUserProject(projectId);
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
    
    useEffect(() => {
        if (userProjects.length) {
            renderUserProjects();
        }
    }, [userProjects]);
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        getUserProjects();
    }, [location.pathname]);
    
    return (
        <div className={`basket_page_container Project_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <h1 className="Account_settings_section_title">{t("MY PROJECTS")}</h1>
            <div className="basket_container Projects_container">
                <div className="basket_flex">
                    <div className="basket_section">
                        <div className="drapery_basket">
                            <div className="drapery_basket_header basket_header">
                                <span className="basket_header_title">{t("PROJECT DETAILS")}</span>
                                <span className="basket_header_price">{t("PRICE")}</span>
                                <span className="basket_header_qty">{t("QTY")}</span>
                                <span className="basket_header_total">{t("TOTAL PRICE")}</span>
                            </div>
                            <ul className="drapery_basket_items">
                                {userProjectsRender}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    );
}

export default Projects;