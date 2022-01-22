import React, {useState, useEffect} from "react";
import axios from "axios";
import SortableTree, {
    addNodeUnderParent, getNodeAtPath, removeNodeAtPath
} from '@nosferatu500/react-sortable-tree';
import Form from 'react-bootstrap/Form';
import {Toast, ToastContainer} from "react-bootstrap";

const baseURL = "http://atlaspood.ir/api/WebsiteMenu/GetByChildren?apikey=477f46c6-4a17-4163-83cc-29908d";

function Menu() {
    const [menu, setMenu] = React.useState({
        menuData: []
    });
    
    const [treeDatas, setTreeData] = useState({
        items: [],
    });
    
    const [nodeTitle, setNodeTitle] = useState('New Menu');
    const [showToast, setShowToast] = React.useState(false);
    
    
    const getMenu = () => {
        axios.get(baseURL).then((response) => {
            let arr = response.data;
            // arr.forEach( obj => renameKey( obj, 'MenuEnName', 'title' ) );
            arr = JSON.parse(JSON.stringify(arr).split('"MenuEnName":').join('"title":'));
            arr = JSON.parse(JSON.stringify(arr).split('"Children":').join('"children":'));
            setMenu({menuData: arr});
            // setMenu({menuData: response.data});
            setTreeData({items: arr})
        }).catch(err => {
            console.log(err);
        });
    };
    
    // function renameKey(obj, oldKey, newKey) {
    //     obj[newKey] = obj[oldKey];
    //     delete obj[oldKey];
    // }
    
    function updateslide() {
    }
    
    
    useEffect(() => {
        getMenu();
    }, []);
    
    return (<div className="menu_page_container">
        <h1 className="menu_title">Menu List</h1>
        <div className="sortableTree_container" style={{display: 'grid', gridTemplateColumns: '1fr'}}>
            <SortableTree
                treeData={treeDatas.items}
                onChange={(treeData) => setTreeData({items: treeData})}
                generateNodeProps={({node, path}) => ({
                    buttons: [<label className="input">
                        <input type="text" value={node["title"]} onChange={(e) => {
                            node["title"] = e.target.value;
                            setTreeData({
                                items: treeDatas.items
                            });
                        }}
                               placeholder="Type Something..."/>
                        <span className="input__label">EN Title</span>
                    </label>, <label className="input">
                        <input type="text" value={node["MenuName"]} onChange={(e) => {
                            node["MenuName"] = e.target.value;
                            setTreeData({
                                items: treeDatas.items
                            });
                        }}
                               placeholder="Type Something..."/>
                        <span className="input__label">FA Title</span>
                    </label>, <button className="btn btn-success"
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
                                                      ProductGroupId: 1,
                                                      PageType: "product",
                                                      PageTypeId: null
                                                  }, getNodeKey: ({treeIndex}) => treeIndex, ignoreCollapsed: true
                                              }).treeData
                                          });
                                          console.log(treeDatas)
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
                        </button>, <label className="input">
                            <input type="text" value={node["ProductGroupId"]} onChange={(e) => {
                                node["ProductGroupId"] = e.target.value;
                                setTreeData({
                                    items: treeDatas.items
                                });
                            }}
                                   placeholder="Type Something..."/>
                            <span className="input__label">Category ID</span>
                        </label>, <Form>
                            <div className="menu_checkbox_container">
                                <span className="input__label">Active?</span>
                                <Form.Check
                                    type='radio'
                                    name="menu_active"
                                    checkbox-choice="true"
                                    label="Yes"
                                    defaultChecked
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
                                    onClick={() => {
                                        node["IsActive"] = false;
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                    }}
                                />
                            </div>
                        </Form>, <Form>
                            <div className="menu_checkbox_container">
                                <span className="input__label">Type?</span>
                                <Form.Check
                                    type='radio'
                                    name="menu_type"
                                    checkbox-choice="Product"
                                    label="Product"
                                    defaultChecked
                                    onClick={() => {
                                        node["PageType"] = "Product";
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                    }}
                                />
                                
                                <Form.Check
                                    type='radio'
                                    name="menu_type"
                                    checkbox-choice="Drapery"
                                    label="Drapery"
                                    onClick={() => {
                                        node["PageType"] = "Drapery";
                                        setTreeData({
                                            items: treeDatas.items
                                        });
                                    }}
                                />
                            </div>
                        </Form>,
                    
                    ],
                    
                })}
            />
        </div>
        
        <div>
            <button className="btn btn-primary admin_panel_button" onClick={() => {
                updateslide()
            }}>Save Settings
            </button>
        </div>
        <ToastContainer className="p-3" position="top-start">
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