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
            if (isLoggedIn) {
                // console.log(projectObj);
                resolve(GetUserProjectData(projectObj, isLoggedIn, undefined,changeLang));
            } else {
                resolve(GetUserProjectData(projectObj, isLoggedIn, undefined,changeLang));
            }
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
                                temp[tempObj["cart"]] = projectObj["PreorderText"][key] ? tempObj["titleValue"][projectObj["PreorderText"][key].toString()] : tempObj["titleValue"]["null"];
                            }
                        }
                    }
                    if (index === Object.keys(projectObj["PreorderText"]).length - 1) {
                        resolve(temp);
                    }
                });
            });
        });
    }
}

export default GetUserProjectData;