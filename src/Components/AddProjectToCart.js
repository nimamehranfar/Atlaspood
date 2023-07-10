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


async function AddProjectToCart(cartValues, SewingModelId, price, ModelNameEn, ModelNameFa, Files, cartProjectIndex, editIndex, navigate, isLoggedIn, customAcc, returnObj) {
    return await new Promise((resolve, reject) => {
        let customPageCart = {};
        let userProjects = JSON.parse(JSON.stringify(UserProjects))[SewingModelId]["data"];
        let temp = JSON.parse(JSON.stringify(cartValues));
        let isCompleted = true;
        // console.log(cartValues, SewingModelId, price, ModelNameEn, ModelNameFa, Files, cartProjectIndex, editIndex, isLoggedIn);
    
        let tempPostObj = {};
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
        tempPostObj["Price"] = price;
        tempPostObj["ModelNameEn"] = ModelNameEn;
        tempPostObj["ModelNameFa"] = ModelNameFa;
        // if(tempPostObj["CalcWindowSize"]===false){
        //     if(tempPostObj["Width1"] && tempPostObj["Height1"]) {
        //         tempPostObj["WidthCart"] = tempPostObj["Width1"];
        //         tempPostObj["HeightCart"] = tempPostObj["Height1"];
        //     }
        // }
        
        if(tempPostObj["ZipCode"] && tempPostObj["ZipCode"]!==""){
            tempPostObj["NeedInstall"] = true;
            tempPostObj["InstallAmount"]=tempPostObj["InstallAmount"]?tempPostObj["InstallAmount"]:0;
            tempPostObj["TransportationAmount"]=tempPostObj["TransportationAmount"]?tempPostObj["TransportationAmount"]:0;
        }
        else{
            tempPostObj["NeedInstall"] = false;
            tempPostObj["InstallAmount"]=0;
            tempPostObj["TransportationAmount"]=0;
        }
        
        tempPostObj["Accessories"] = [];
        Object.keys(temp).forEach(key => {
            if (temp[key] !== null || temp[key] !== "") {
                let tempObj = userProjects.find(obj => obj["cart"] === key);
                if (tempObj) {
                    if (tempObj["apiAcc"] !== undefined) {
                        if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                            tempPostObj["Accessories"].push(tempObj["apiAccValue"][temp[key]]);
                        } else {
                        
                        }
                    }
                }
            }
        });
        if (customAcc!==undefined && Array.isArray(customAcc) && customAcc.length > 0) {
            tempPostObj["Accessories"].push(...customAcc);
        }
        else if(customAcc!==undefined && Object.keys(customAcc).length > 0){
            tempPostObj["Accessories"].push(customAcc);
        }
        tempPostObj["Accessories"]=tempPostObj["Accessories"].filter(n => n);
        
        tempPostObj["SewingModelId"] = SewingModelId;
        tempPostObj["isCompleted"] = isCompleted;
        tempPostObj["WindowCount"] = 1;
        tempPostObj["Count"] = 1;
        tempPostObj["IsLowWrinkle"] = true;
        tempPostObj["IsCoverAll"] = true;
        tempPostObj["IsAltogether"] = true;
        tempPostObj["IsActive"] = true;
        tempPostObj["Price"] = price;
        tempPostObj["WindowDescription"] = tempPostObj["WindowName"];
        // tempObj["hasAutomate"] = tempPostObj["hasAutomate"] === undefined ? false : tempPostObj["hasAutomate"];
    
        tempPostObj["PreorderText"] = JSON.parse(JSON.stringify(tempPostObj));
        
        if (cartProjectIndex && cartProjectIndex !== -1) {
            tempPostObj["SewingPreorderId"] = cartProjectIndex;
        }
        if (tempPostObj["SewingPreorderId"] && (tempPostObj["SewingPreorderId"] === -1 || tempPostObj["SewingPreorderId"] === "-1")) {
            delete tempPostObj["SewingPreorderId"];
        }
    
        Files[0]=Files[0].filter(x => !!x);
        Files[1]=Files[1].filter(x => !!x);
        Files[2]=Files[2].filter(x => !!x);
        Files[3]=Files[3].filter(x => !!x);
    
        if(Files[0].length+Files[2].length>0){
            tempPostObj["SewingOrderAttachments"]=[];
            Files[0].forEach((obj,index) => {
                tempPostObj["SewingOrderAttachments"].push({
                    "FileUrl": Files[1][index],
                    "UserFileName": obj
                })
            });
            Files[2].forEach((obj,index) => {
                tempPostObj["SewingOrderAttachments"].push({
                    "FileUrl": Files[3][index],
                    "UserFileName": obj
                })
            });
        }
    
        if(returnObj){
            resolve(tempPostObj);
        }
        else {
            if (isLoggedIn) {
                // console.log(tempPostObj);
                axios.post(editIndex ? baseURLEditProject : baseURLAddProjectToCart, tempPostObj, {
                    headers: authHeader()
                })
                    .then(() => {
                        axios.get(baseURLGetCart, {
                            headers: authHeader()
                        }).then((response) => {
                            // console.log(response.data ? response.data : {});
                            resolve(response.data ? response.data : {})
                        }).catch(err => {
                                console.log(err);
                            if (err.response && err.response.status === 401) {
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
                    newCartArr[0] = tempPostObj;
                    newCartObj["drapery"] = newCartArr;
                    newCartObj["product"] = [];
                    newCartObj["swatches"] = [];
                    localStorage.setItem('cart', JSON.stringify(newCartObj));
                    customPageCart = newCartObj;
                } else {
                    let cartObj = JSON.parse(localStorage.getItem("cart"));
                    if (cartObj["drapery"] === undefined || cartObj["drapery"].length === 0) {
                        let newCartArr = [];
                        newCartArr[0] = tempPostObj;
                        cartObj["drapery"] = newCartArr;
                        localStorage.setItem('cart', JSON.stringify(cartObj));
                        customPageCart = cartObj;
                    } else {
                        if (cartProjectIndex !== -1) {
                            if (cartObj["drapery"][cartProjectIndex]) {
                                cartObj["drapery"][cartProjectIndex] = tempPostObj;
                                localStorage.setItem('cart', JSON.stringify(cartObj));
                                customPageCart = cartObj;
                            } else {
                                customPageCart = cartObj;
                            }
                        } else {
                            cartObj["drapery"].push(tempPostObj);
                            localStorage.setItem('cart', JSON.stringify(cartObj));
                            customPageCart = cartObj;
                        }
                    }
                }
                resolve(customPageCart);
            }
        }
    });
    
}

export default AddProjectToCart;