import React from "react";
import axios from "axios";
import authHeader from "../Services/auth-header";
import UserProjects from "./UserProjects";
import {refreshToken} from "../Services/auth.service";
import {LOGIN, LOGOUT} from "../Actions/types";
import {useDispatch} from "react-redux";
import store from "../store";

const baseURLAddProject = "https://api.atlaspood.ir/SewingPreorder/Add";
const baseURLEditProject = "https://api.atlaspood.ir/SewingPreorder/Edit";


async function SaveUserProject(depSet, cartValues, Files, SewingModelId, price, ModelNameEn, ModelNameFa, projectData) {
    // const dispatch = useDispatch();
    // console.log(depSet,projectData);
    if(projectData===undefined) {
        return await new Promise((resolve, reject) => {
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[SewingModelId]["data"];
            let temp = JSON.parse(JSON.stringify(cartValues));
            // console.log(cartValues);
        
            let tempDepSet = [...depSet];
            let tempNewSet = new Set();
            tempDepSet.forEach(dependency => {
                tempNewSet.add(dependency.split('')[0]);
            });
            let isCompleted = !(tempNewSet.size > 0);
            
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
            
            // console.log(tempObj);
            axios.post(baseURLAddProject, tempObj, {
                headers: authHeader()
            })
                .then((response) => {
                    resolve(true);
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
                        resolve(false);
                    }
                });
        });
    }
    else{
        return await new Promise((resolve, reject) => {
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[SewingModelId]["data"];
            let temp = JSON.parse(JSON.stringify(cartValues));
        
            let tempDepSet = [...depSet];
            let tempNewSet = new Set();
            tempDepSet.forEach(dependency => {
                tempNewSet.add(dependency.split('')[0]);
            });
            let isCompleted = !(tempNewSet.size > 0);
            
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
            if(tempPostObj["CalcWindowSize"]===false){
                if(tempPostObj["Width1"] && tempPostObj["Height1"]) {
                    tempPostObj["WidthCart"] = tempPostObj["Width1"];
                    tempPostObj["HeightCart"] = tempPostObj["Height1"];
                }
            }
            
            if (tempPostObj["FabricId"] !== undefined)
                projectData["FabricId"] = tempPostObj["FabricId"];
            projectData["isCompleted"] = isCompleted;
            projectData["PreorderText"] = tempPostObj;
    
            Files[0]=Files[0].filter(x => !!x);
            Files[1]=Files[1].filter(x => !!x);
            Files[2]=Files[2].filter(x => !!x);
            Files[3]=Files[3].filter(x => !!x);
    
            if(Files[0].length+Files[2].length>0){
                projectData["SewingOrderAttachments"]=[];
                Files[0].forEach((obj,index) => {
                    projectData["SewingOrderAttachments"].push({
                        "FileUrl": Files[1][index],
                        "UserFileName": obj
                    })
                });
                Files[2].forEach((obj,index) => {
                    projectData["SewingOrderAttachments"].push({
                        "FileUrl": Files[3][index],
                        "UserFileName": obj
                    })
                });
            }
            // console.log(tempPostObj);
            axios.post(baseURLEditProject, projectData, {
                headers: authHeader()
            })
                .then((response) => {
                    resolve(true);
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
                        resolve(false);
                    }
                });
        });
    }
}

export default SaveUserProject;