import React from "react";
import axios from "axios";
import authHeader from "../Services/auth-header";
import {refreshToken} from "../Services/auth.service";
import {useSelector} from "react-redux";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import UserProjects from "./UserProjects";


const baseURLAddProjectToCart = "https://api.atlaspood.ir/cart/AddSewingPreorder";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";
const baseURLGetCart = "https://api.atlaspood.ir/cart/GetAll";


async function AddProjectToCart(cartValues, SewingModelId, price, ModelNameEn, ModelNameFa, Files, cartProjectIndex, editIndex, navigate, isLoggedIn) {
    
    
    return await new Promise((resolve, reject) => {
        let customPageCart = {};
        let userProjects = JSON.parse(JSON.stringify(UserProjects))[SewingModelId]["data"];
        let temp = JSON.parse(JSON.stringify(cartValues));
        let isCompleted = true;
    
        let tempPostObj = {};
        tempPostObj["SewingModelId"] = SewingModelId;
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                if (tempObj && tempObj["apiLabel"] !== "") {
                    if (tempObj["apiValue"] === null) {
                        tempPostObj[tempObj["apiLabel"]] = temp[key];
                    } else {
                        tempPostObj[tempObj["apiLabel"]] = tempObj["apiValue"][temp[key]];
                    }
                }
            }
        });
        tempPostObj["price"] = price;
        tempPostObj["ModelNameEn"] = ModelNameEn;
        tempPostObj["ModelNameFa"] = ModelNameFa;
        tempPostObj["SewingModelId"] = SewingModelId;
        tempPostObj["WindowCount"] = 1;
        if(tempPostObj["CalcWindowSize"]===false){
            if(tempPostObj["Width1"] && tempPostObj["Height1"]) {
                tempPostObj["WidthCart"] = tempPostObj["Width1"];
                tempPostObj["HeightCart"] = tempPostObj["Height1"];
            }
        }
    
        let tempObj = {};
        tempObj["Count"] = 1;
        if (tempPostObj["FabricId"] !== undefined)
            tempObj["FabricId"] = tempPostObj["FabricId"];
        tempObj["SewingModelId"] = SewingModelId;
        tempObj["isCompleted"] = isCompleted;
        tempObj["price"] = price;
        // tempObj["hasAutomate"] = tempPostObj["hasAutomate"] === undefined ? false : tempPostObj["hasAutomate"];
        tempObj["PreorderText"] = tempPostObj;
        if (cartProjectIndex && cartProjectIndex !== -1) {
            tempObj["SewingPreorderId"] = cartProjectIndex;
        }
        if (tempObj["SewingPreorderId"] && (tempObj["SewingPreorderId"] === -1 || tempObj["SewingPreorderId"] === "-1")) {
            delete tempObj["SewingPreorderId"];
        }
    
        Files[0]=Files[0].filter(x => !!x);
        Files[1]=Files[1].filter(x => !!x);
        Files[2]=Files[2].filter(x => !!x);
        Files[3]=Files[3].filter(x => !!x);
    
        if(Files[0].length+Files[2].length>0){
            tempObj["SewingOrderAttachments"]=[];
            Files[0].forEach((obj,index) => {
                tempObj["SewingOrderAttachments"].push({
                    "FileUrl": Files[1][index],
                    "UserFileName": obj
                })
            });
            Files[2].forEach((obj,index) => {
                tempObj["SewingOrderAttachments"].push({
                    "FileUrl": Files[3][index],
                    "UserFileName": obj
                })
            });
        }
    
        // console.log(tempPostObj,isLoggedIn);
        if (isLoggedIn) {
            // console.log(tempObj);
            axios.post(editIndex ? baseURLEditProject : baseURLAddProjectToCart, tempObj, {
                headers: authHeader()
            })
                .then(() => {
                    axios.get(baseURLGetCart, {
                        headers: authHeader()
                    }).then((response) => {
                        resolve(response.data)
                    }).catch(err => {
                        if (err.response.status === 401) {
                            refreshToken().then((response2) => {
                                if (response2 !== false) {
                                    resolve(401);
                                } else {
                                    navigate("/en" + "/User");
                                    reject();
                                }
                            });
                        } else {
                            resolve(false);
                        }
                    });
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        refreshToken().then((response2) => {
                            if (response2 !== false) {
                                resolve(401);
                            } else {
                                reject();
                            }
                        });
                    } else {
                        console.log("project not added to cart");
                        resolve(false);
                    }
                });
        } else {
            if (localStorage.getItem("cart") === null) {
                let newCartObj = {};
                let newCartArr = [];
                newCartArr[0] = tempObj;
                newCartObj["drapery"] = newCartArr;
                newCartObj["product"] = [];
                newCartObj["swatches"] = [];
                localStorage.setItem('cart', JSON.stringify(newCartObj));
                customPageCart = newCartObj;
            } else {
                let cartObj = JSON.parse(localStorage.getItem("cart"));
                if (cartObj["drapery"] === undefined || cartObj["drapery"].length === 0) {
                    let newCartArr = [];
                    newCartArr[0] = tempObj;
                    cartObj["drapery"] = newCartArr;
                    localStorage.setItem('cart', JSON.stringify(cartObj));
                    customPageCart = cartObj;
                } else {
                    if (cartProjectIndex !== -1) {
                        if (cartObj["drapery"][cartProjectIndex]) {
                            cartObj["drapery"][cartProjectIndex] = tempObj;
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            customPageCart = cartObj;
                        } else {
                            customPageCart = cartObj;
                        }
                    } else {
                        cartObj["drapery"].push(tempObj);
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        customPageCart = cartObj;
                    }
                }
            }
            resolve(customPageCart);
        }
    });
    
}

export default AddProjectToCart;