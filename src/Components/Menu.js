import React, {useState, useEffect} from "react";
import axios from "axios";
import SortableTree, {
    addNodeUnderParent, getNodeAtPath, removeNodeAtPath
} from '@nosferatu500/react-sortable-tree';
import Form from 'react-bootstrap/Form';
import {Toast, ToastContainer} from "react-bootstrap";
import Select from 'react-select';


const baseURL = "http://atlaspood.ir/api/WebsiteMenu/GetByChildren?apikey=477f46c6-4a17-4163-83cc-29908d";
const baseURLPost = "http://atlaspood.ir/api/WebsiteMenu/Save";
const baseURLDeleteAll = "http://atlaspood.ir/api/WebsiteMenu/DeleteAll?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLModels = "http://atlaspood.ir/api/SewingModel/GetAll?apiKey=477f46c6-4a17-4163-83cc-29908d";

function Menu() {
    const [menu, setMenu] = React.useState({
        menuData: []
    });
    
    const [treeDatas, setTreeData] = useState({
        items: [],
    });
    
    const [nodeTitle, setNodeTitle] = useState('New Menu');
    const [showToast, setShowToast] = React.useState(false);
    const [models, setModels] = useState([]);
    const [options, setOptions] =useState( []);
    
    const getOptions = () => {
        let tempArr = [];
        for (let i = 50; i < 451; i++) {
            let tempObj = {};
            tempObj["value"] = `${i}`;
            tempObj["label"] = `${i}px`;
            tempArr.push(tempObj);
        }
        setOptions(tempArr);
    };
    
    
    const getMenu = () => {
        axios.get(baseURL).then((response) => {
            let arr = response.data;
            // arr.forEach( obj => renameKey( obj, 'MenuEnName', 'title' ) );
            let sortedMenu = [];
            for (let i = 0; i < arr.length; i++) {
                sortedMenu[arr[i].MenuOrder] = arr[i];
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
    
            sortedMenu = JSON.parse(JSON.stringify(sortedMenu).split('"MenuEnName":').join('"title":'));
            sortedMenu = JSON.parse(JSON.stringify(sortedMenu).split('"Children":').join('"children":'));
            
            
            
            // setMenu({menuData: arr});
            // setMenu({menuData: response.data});
            setTreeData({items: sortedMenu})
        }).catch(err => {
            console.log(err);
        });
    };
    
    const getModels = () => {
        axios.get(baseURLModels).then((response) => {
            let arr = response.data;
            let tempArr = [];
            arr.forEach(obj => {
                let tempObj = {};
                tempObj["value"] = obj["SewingModelId"];
                tempObj["label"] = obj["ModelENName"];
                tempArr.push(tempObj);
            });
            setModels(tempArr);
            
        }).catch(err => {
            console.log(err);
        });
    };
    
    // function renameKey(obj, oldKey, newKey) {
    //     obj[newKey] = obj[oldKey];
    //     delete obj[oldKey];
    // }
    
    function updateMenu() {
        let postMenuArray = {};
        postMenuArray["MenuViewList"] = [];
        postMenuArray["MenuViewList"] = treeDatas.items;
        postMenuArray["ApiKey"] = window.$apikey;
        postMenuArray = JSON.parse(JSON.stringify(postMenuArray).split('"title":').join('"MenuEnName":'));
        postMenuArray = JSON.parse(JSON.stringify(postMenuArray).split('"children":').join('"Children":'));
    
        for (let i = 0; i < postMenuArray["MenuViewList"].length; i++) {
            let Children = postMenuArray["MenuViewList"][i].Children;
            postMenuArray["MenuViewList"][i].MenuOrder=i;
            for (let j = 0; j < Children.length; j++) {
                let subChildren = Children[j].Children;
                Children[j].MenuOrder=j;
                for (let k = 0; k < subChildren.length; k++) {
                    subChildren[k].MenuOrder=k;
                }
            }
        }
        console.log(postMenuArray);
        postMenuArray["MenuViewList"].forEach(obj => {
            obj["Children"].forEach(obj2 => {
                delete obj2.expanded;
            });
            delete obj.expanded;
        });
        postMenuArray["MenuViewList"].forEach(obj => {
            obj["Children"].forEach(obj2 => {
                delete obj2.WebsiteMenuId;
            });
            delete obj.WebsiteMenuId;
        });
        postMenuArray["MenuViewList"].forEach(obj => {
            obj["Children"].forEach(obj2 => {
                delete obj2.ParentMenu;
            });
            delete obj.ParentMenu;
        });
        
        console.log(JSON.stringify(postMenuArray));
        
        axios.delete(baseURLDeleteAll).then((delete_response) => {
            axios.post(baseURLPost, postMenuArray)
                .then((response) => {
                    setShowToast(true);
                }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }
    
    const products = [];
    for (let i = 1; i < 91; i++) {
        let tempObj = {};
        tempObj["value"] = `${i}`;
        tempObj["label"] = `product ${i}`;
        products.push(tempObj);
    }
    const singleOption = ({innerProps, isDisabled, label, isSelected}) =>
        !isDisabled ? (
            <div {...innerProps} className="custom_multiselect_option">
                <input className="multiselect_checkbox" type="checkbox" checked={isSelected} onChange={() => null}/>
                <label className="multiselect_label">{label}</label>
            </div>) : null;
    
    function makeSelectedObjects(node) {
        let catString = node["ListOfCategory"];
        if (catString != null && catString !== "") {
            let catArr = catString.split(',');
            let tempArr = [];
            catArr.forEach(obj => {
                let tempObj = {};
                tempObj["value"] = `${obj}`;
                tempArr.push(tempObj);
            });
            return tempArr;
        } else {
            return null;
        }
    }
    
    // function makeSelectedObject_width(node) {
    //     console.log(options[node["Width"]-50]);
    //     return options[node["Width"]-50];
        // let tempWidth = node["Width"];
        // console.log(options);
        // if (tempWidth != null && tempWidth !== "") {
        //     // let tempArr = [];
        //     let tempObj = {};
        //     tempObj["value"] = `${tempWidth}`;
        //     tempObj["label"] = `${tempWidth}px`;
        //     // tempArr.push(tempObj);
        //     return tempObj;
        // } else {
        //     return null;
        // }
    // }
    
    
    useEffect(() => {
        getMenu();
        getModels();
        getOptions();
    }, []);
    
    return (<div className="menu_page_container">
        <h1 className="menu_title">Menu List</h1>
        <div className="sortableTree_container" style={{display: 'grid', gridTemplateColumns: '1fr'}}>
            <SortableTree
                treeData={treeDatas.items}
                onChange={(treeData) => setTreeData({items: treeData})}
                generateNodeProps={({node, path}) => ({
                    buttons: [
                        <label className="input">
                            <input type="text" value={node["title"]} onChange={(e) => {
                                node["title"] = e.target.value;
                                setTreeData({
                                    items: treeDatas.items
                                });
                            }}
                                   placeholder="Type Something..."/>
                            <span className="input__label">EN Title</span>
                        </label>,
                        <label className="input">
                            <input type="text" value={node["MenuName"]} onChange={(e) => {
                                node["MenuName"] = e.target.value;
                                setTreeData({
                                    items: treeDatas.items
                                });
                            }}
                                   placeholder="Type Something..."/>
                            <span className="input__label">FA Title</span>
                        </label>,
                        <button className="btn btn-success"
                                onClick={() => {
                                    setTreeData({
                                        items: addNodeUnderParent({
                                            treeData: treeDatas.items, parentKey: path[path.length - 1], expandParent: true, getNodeAtPath, newNode: {
                                                title: nodeTitle,
                                                children: [],
                                                MenuName: "منو جدید",
                                                MenuDescription: null,
                                                ImageUrl: null,
                                                MenuOrder: 0,
                                                ParentMenuId: null,
                                                OnFooter: false,
                                                IsActive: true,
                                                ParentMenu: null,
                                                CategoryId: 1,
                                                PageTypeId: 5501,
                                                Width: 180,
                                                ListOfCategory: "0001,0310"
                                            }, getNodeKey: ({treeIndex}) => treeIndex, ignoreCollapsed: true
                                        }).treeData
                                    });
                                }}
                        >
                            Add Child
                        </button>, // <button className="btn btn-warning"
                        //         onClick={() => {
                        //             node.title = nodeTitle;
                        //             setTreeData({
                        //                 items:
                        //                 treeData.items
                        //             });
                        //         }
                        //         }
                        // >
                        //     Edit
                        // </button>,
                        <button className="btn btn-danger"
                                onClick={() => {
                                    setTreeData({
                                        items: removeNodeAtPath({
                                            treeData: treeDatas.items, path, getNodeKey: ({treeIndex}) => treeIndex
                                        })
                                    });
                                }}
                        >
                            Remove
                        </button>,
                        <label className="input">
                            <input type="text" value={node["CategoryId"]} onChange={(e) => {
                                node["CategoryId"] = e.target.value;
                                setTreeData({
                                    items: treeDatas.items
                                });
                            }}
                                   placeholder="Type Something..."/>
                            <span className="input__label">Category ID</span>
                        </label>,
                        <Form>
                            <div className="menu_radio_container">
                                <span className="input__label">Active?</span>
                                <Form.Check
                                    type='radio'
                                    name="menu_active"
                                    checkbox-choice="true"
                                    label="Yes"
                                    defaultChecked={node["IsActive"]}
                                    onClick={() => {
                                        node["IsActive"] = true;
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                    }}
                                />
                                
                                <Form.Check
                                    type='radio'
                                    name="menu_active"
                                    checkbox-choice="false"
                                    label="No"
                                    defaultChecked={!node["IsActive"]}
                                    onClick={() => {
                                        node["IsActive"] = false;
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                    }}
                                />
                            </div>
                        </Form>,
                        <Form>
                            <div className="menu_radio_container">
                                <span className="input__label">Type?</span>
                                <Form.Check
                                    type='radio'
                                    name="menu_type"
                                    checkbox-choice="Product"
                                    label="Product"
                                    defaultChecked={node["PageTypeId"] === 5501 && true}
                                    onClick={() => {
                                        node["PageTypeId"] = 5501;
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                        node["ListOfCategory"] = "";
                                    }}
                                />
                                
                                <Form.Check
                                    type='radio'
                                    name="menu_type"
                                    checkbox-choice="Curtain"
                                    label="Curtain"
                                    defaultChecked={node["PageTypeId"] === 5502 && true}
                                    onClick={() => {
                                        node["PageTypeId"] = 5502;
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                        node["ListOfCategory"] = "";
                                    }}
                                />
                            </div>
                        </Form>,
                        node["PageTypeId"] === 5502 &&
                        <div className="menu_select_category_container">
                            <span className="input__label">Models</span>
                            <Select
                                components={{Option: singleOption}}
                                onChange={(selected) => {
                                    node["ListOfCategory"] = "";
                                    let tempArr = [];
                                    selected.forEach(obj => {
                                        tempArr.push(obj["value"]);
                                    });
                                    node["ListOfCategory"] = `${tempArr.join(",")}`;
                                }}
                                options={models}
                                isMulti={true}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                controlShouldRenderValue={false}
                                defaultValue={makeSelectedObjects(node)}
                            />
                        </div>,
                        node["PageTypeId"] === 5501 &&
                        <div className="menu_select_category_container">
                            <span className="input__label">Products</span>
                            <Select
                                components={{Option: singleOption}}
                                onChange={(selected) => {
                                    node["ListOfCategory"] = "";
                                    let tempArr = [];
                                    selected.forEach(obj => {
                                        tempArr.push(obj["value"]);
                                    });
                                    node["ListOfCategory"] = `${tempArr.join(",")}`;
                                }}
                                options={products}
                                isMulti={true}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                controlShouldRenderValue={false}
                                defaultValue={makeSelectedObjects(node)}
                            />
                        </div>,
                        
                        <div className="menu_select_container">
                            <span className="input__label">Menu Width</span>
                            <Select
                                onChange={(selected) => {
                                    node["Width"] = parseInt(selected["value"]);
                                }}
                                options={options}
                                // value={makeSelectedObject_width(node)}
                            />
                        </div>,
                        <div className="menu_width_container">
                            <span className="input__label">Pre-set Width</span>
                            <div className="m-auto text-center">{node["Width"]}px</div>
                        </div>
                    
                    ],
                    
                })}
            />
        </div>
        
        <div>
            <button className="btn btn-primary admin_panel_button" onClick={() => {
                updateMenu()
            }}>Save Settings
            </button>
        </div>
        <ToastContainer className="p-3 position_fixed" position="top-start">
            <Toast onClose={() => setShowToast(false)} bg="success" show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Success</strong>
                    {/*<small>couple of seconds ago</small>*/}
                </Toast.Header>
                <Toast.Body>Saved Successfully!</Toast.Body>
            </Toast>
        </ToastContainer>
    </div>);
}

export default Menu;