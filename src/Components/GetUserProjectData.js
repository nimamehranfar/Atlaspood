import React from "react";
import UserProjects from "./UserProjects";


async function GetUserProjectData(projectObj, isLoggedIn, editIndex,changeLang) {
    
    if (changeLang !== undefined) {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(projectObj);
            }, 500);
        });
    }
    else if (editIndex !== undefined) {
        return await new Promise((resolve, reject) => {
            // if (isLoggedIn) {
            //     // console.log(projectObj);
            //     resolve(GetUserProjectData(projectObj, isLoggedIn, undefined,changeLang));
            // } else {
            //     resolve(GetUserProjectData(projectObj, isLoggedIn, undefined,changeLang));
            // }
            resolve(GetUserProjectData(projectObj, isLoggedIn, undefined,changeLang));
        });
    } else {
        return await new Promise((resolve, reject) => {
            // console.log(projectObj,projectObj["SewingModelId"]);
            let userProjects = JSON.parse(JSON.stringify(UserProjects))[projectObj["SewingModelId"]]["data"];
            let temp = {};
    
    
            let imageExtensionList=["jpg","png","jpeg","jiff","gif","webp"];
            let pdfExtensionList=["pdf"];
            
            let promise3 = new Promise((resolve, reject) => {
                if (projectObj["SewingOrderAttachments"] && projectObj["SewingOrderAttachments"].length > 0) {
                    temp["uploadedImagesFile"] = [];
                    temp["uploadedImagesURL"] = [];
                    temp["uploadedPDFFile"] = [];
                    temp["uploadedPDFURL"] = [];
                    projectObj["SewingOrderAttachments"].forEach((obj, index) => {
                        let extensionSearch = /(?:\.([^.]+))?$/;
                        let extension = extensionSearch.exec(obj["UserFileName"])[1].toLowerCase();
                        // console.log(extension,imageExtensionList.indexOf(extension) > -1,pdfExtensionList.indexOf(extension) > -1);
                        if(imageExtensionList.indexOf(extension) > -1){
                            temp["uploadedImagesURL"][index] = obj["FileUrl"];
                            temp["uploadedImagesFile"][index] = obj["UserFileName"];
                        }
                        else if(pdfExtensionList.indexOf(extension) > -1){
                            temp["uploadedPDFURL"][index] = obj["FileUrl"];
                            temp["uploadedPDFFile"][index] = obj["UserFileName"];
                        }
                        if (index === projectObj["SewingOrderAttachments"].length - 1) {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            });
            // console.log(projectObj);
            promise3.then(() => {
                Object.keys(projectObj["PreorderText"]).forEach((key, index) => {
                    if (projectObj["PreorderText"][key] !== null || projectObj["PreorderText"][key] !== "") {
                        let tempObj = userProjects.find(obj => obj["apiLabel"] === key);
                        if (tempObj) {
                            if (tempObj["titleValue"] === null) {
                                temp[tempObj["cart"]] = projectObj["PreorderText"][key];
                            } else {
                                temp[tempObj["cart"]] = tempObj["titleValue"][projectObj["PreorderText"][key].toString()];
                            }
                        }
                        else{
                            // console.log(key);
                        }
                    }
                    if (index === Object.keys(projectObj["PreorderText"]).length - 1) {
                        temp["Accessories"]=projectObj["PreorderText"]["Accessories"] || [];
                        // console.log(temp["Accessories"]);
                        Object.keys(temp).forEach((key,j) => {
                            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== "") {
                                let tempObj = userProjects.find(obj => obj["cart"] === key);
                                if (tempObj) {
                                    if (tempObj["apiAcc"] !== undefined) {
                                        if (tempObj["apiAcc"] === true && tempObj["apiAccValue"][temp[key]]) {
                                            const i = temp["Accessories"].filter(n => n).findIndex(e => e&& e.SewingAccessoryValue && e.SewingAccessoryValue ===tempObj["apiAccValue"][temp[key]]&& tempObj["apiAccValue"][temp[key]]["SewingAccessoryValue"]);
                                            if (i > -1) {
                                                temp["Accessories"].splice(i,1);
                                            }
                                        } else {
                        
                                        }
                                    }
                                }
                            }
    
                            if (j === Object.keys(temp).length - 1) {
                                // console.log(temp);
                                resolve(temp);
                            }
                        });
                    }
                });
            });
        });
    }
}

export default GetUserProjectData;