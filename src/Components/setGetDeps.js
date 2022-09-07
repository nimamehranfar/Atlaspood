import React from "react";


function setGetDeps(addDeps, removeDeps, depSet) {
    let depSetTempArr = new Set([...depSet]);
    if (addDeps !== undefined && addDeps !== "") {
        let tempArr = addDeps.split(',');
        tempArr.forEach(dep => {
            if (dep !== undefined && dep !== "") {
                depSetTempArr.add(dep);
            }
        });
    }
    if (removeDeps !== undefined && removeDeps !== "") {
        let tempArr = removeDeps.split(',');
        tempArr.forEach(dep => {
            if (dep !== undefined && dep !== "") {
                depSetTempArr = new Set([...depSetTempArr].filter(x => x !== dep))
                // depSetTempArr.delete(dep);
            }
        });
    }
    // console.log([...new Set(depSet)]);
    // console.log(depSetTempArr);
    return(depSetTempArr);
}
export default setGetDeps;