import {Link, useLocation, useParams} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {Accordion, AccordionContext, Card, useAccordionButton} from "react-bootstrap"
import ReactTooltip from 'react-tooltip';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'

import {ReactComponent as MountInside} from '../Images/drapery/zebra/mount_inside.svg';
import {ReactComponent as MountOutside} from '../Images/drapery/zebra/mount_outside.svg';
import Form from "react-bootstrap/Form";


const baseURLCats = "http://atlaspood.ir/api/SewingModel/GetByCategory";
const baseURLFabrics = "http://atlaspood.ir/api/Sewing/GetModelFabric";


function Zebra({CatID, ModelID}) {
    const {t} = useTranslation();
    const location = useLocation();
    const [catID, setCatID] = useState("");
    const [modelID, setModelID] = useState("");
    const [models, setModels] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [fabricsList, setFabricsList] = useState([]);
    const [defaultFabricPhoto, setDefaultFabricPhoto] = React.useState(null);
    const [defaultModelName, setDefaultModelName] = React.useState("");
    const [show, setShow] = React.useState(false);
    const [searchShow, setSearchShow] = React.useState(false);
    const [zoomModalBody, setZoomModalBody] = React.useState([]);
    const [pageLanguage, setPageLanguage] = React.useState("");
    const selectedTitle = useRef([]);
    const search_input = useRef(null);
    
    
    function convertToPersian(string_farsi) {
        if (string_farsi !== null && string_farsi !== undefined && string_farsi !== "") {
            let tempString = string_farsi.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace("ي", "ی");
            tempString = tempString.replace('ك', 'ک');
            return tempString;
        } else
            return string_farsi;
    }
    
    const getFabrics = () => {
        axios.get(baseURLFabrics, {
            params: {
                modelId: modelID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            let tempFabrics = [];
            response.data.forEach(obj => {
                if (tempFabrics[obj["DesignEnName"]] === "" || tempFabrics[obj["DesignEnName"]] === undefined || tempFabrics[obj["DesignEnName"]] === null || tempFabrics[obj["DesignEnName"]] === [])
                    tempFabrics[obj["DesignEnName"]] = [];
                tempFabrics[obj["DesignEnName"]].push(obj);
            });
            
            setFabrics(tempFabrics);
        }).catch(err => {
            console.log(err);
        });
    };
    
    const getCats = () => {
        axios.get(baseURLCats, {
            params: {
                categoryId: catID,
                apiKey: window.$apikey
            }
        }).then((response) => {
            setModels(response.data);
        }).catch(err => {
            console.log(err);
        });
    };
    
    function renderFabrics() {
        const fabricList = [];
        let count = 0
        Object.keys(fabrics).forEach((key, index) => {
            let DesignName = convertToPersian(fabrics[key][0].DesignName);
            let DesignEnName = fabrics[key][0].DesignEnName;
            
            const fabric = [];
            for (let j = 0; j < fabrics[key].length; j++) {
                let FabricId = fabrics[key][j].FabricId;
                let PhotoPath = fabrics[key][j].PhotoPath;
                let HasTrim = fabrics[key][j].HasTrim;
                let DesignCode = fabrics[key][j].DesignCode;
                let DesignRaportLength = fabrics[key][j].DesignRaportLength;
                let DesignRaportWidth = fabrics[key][j].DesignRaportWidth;
                
                fabric.push(
                    <div className="radio_group" key={"fabric" + key + j}>
                        <label data-tip={`${pageLanguage === 'en' ? DesignEnName : DesignName}: ${pageLanguage === 'en' ? "No Name In API" : "بدون نام"}`}
                               data-for={"fabric" + key + j} className="radio_container" data-img={`http://www.doopsalta.com/upload/${PhotoPath}`}>
                            <ReactTooltip id={"fabric" + key + j} place="top" type="light" effect="float"/>
                            <input className="radio" type="radio" ref-num="1" onClick={e => {
                                fabricClicked(e, HasTrim);
                                selectChanged(e);
                            }} name="fabric"
                                   model-id={modelID} value={pageLanguage === 'en' ? DesignEnName : DesignName}/>
                            <div className="frame_img">
                                <img className="img-fluid" src={`http://www.doopsalta.com/upload/${PhotoPath}`} alt=""/>
                            </div>
                        </label>
                        <div className="fabric_name_container">
                            <h1>{pageLanguage === 'en' ? "No Name In API" : "بدون نام"}</h1>
                            <span onClick={() => handleShow(PhotoPath, DesignName, DesignEnName, "No Name In API")}><i className="fa fa-search" aria-hidden="true"/></span>
                        </div>
                        <button className="swatchButton" current-state="0" onClick={e => fabricSwatch(e, FabricId)}>ORDER SWATCH</button>
                    </div>
                );
                
            }
            
            fabricList.push(
                <div className="material_detail" key={"fabric" + key}>
                    <div className="material_traits">
                        <hr/>
                        <span>DESIGN NAME: {pageLanguage === 'en' ? DesignEnName : DesignName}</span>
                    </div>
                    {fabric}
                </div>
            );
            
        });
        setFabricsList(fabricList);
        // console.log(fabricList)
    }
    
    function handleClose() {
        setShow(false);
    }
    
    function handleShow(PhotoPath, DesignName, DesignEnName, name) {
        const tempDiv = [];
        tempDiv.push(
            <div key={PhotoPath} className="zoomImg">
                <span className="s">{pageLanguage === 'en' ? DesignEnName : DesignName} / {name}</span>
                <div className="imageContainer">
                    <img className="img-fluid hover-zoom" src={`http://www.doopsalta.com/upload/${PhotoPath}`} alt=""/>
                </div>
            </div>
        );
        setZoomModalBody(tempDiv);
        setShow(true);
    }
    
    function ContextAwareToggle({stepNum, stepTitle, stepSelected, eventKey, callback}) {
        const {activeEventKey} = useContext(AccordionContext);
        
        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );
        
        const isCurrentEventKey = activeEventKey === eventKey;
        
        return (
            <div
                className={`w-100 h-100 steps_header ${isCurrentEventKey ? 'steps_header_active' : ''}`}
                onClick={decoratedOnClick}>
                <div className="steps_header_num_container">
                    <div className="steps_header_num">{stepNum}</div>
                </div>
                <div className="steps_header_title_container">
                    <div className="steps_header_title">{stepTitle}</div>
                </div>
                <div className="steps_header_selected_container">
                    <div className="steps_header_selected" ref={ref => (selectedTitle.current[stepNum] = ref)}>{stepSelected}</div>
                </div>
            </div>
        );
    }
    
    function selectChanged(e) {
        // console.log(e.target.value);
        let refIndex = e.target.getAttribute('ref-num');
        selectedTitle.current[refIndex].innerHTML = e.target.value;
    }
    
    function fabricClicked(e, hasTrim) {
        // let refIndex = e.target.getAttribute('ref-num');
        // selectedTitle.current[refIndex].innerHTML = e.target.value;
    }
    
    function fabricSwatch(e, fabricId) {
        let currentState = e.target.getAttribute('current-state');
        if (currentState === "0") {
            e.target.innerHTML = "SWATCH IN CART";
            e.target.setAttribute('current-state', "1");
            e.target.className = "swatchButton activeSwatch";
        } else {
            e.target.innerHTML = "ORDER SWATCH";
            e.target.setAttribute('current-state', "0");
            e.target.className = "swatchButton";
        }
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }, [location.pathname]);
    
    useEffect(() => {
        if (models.length) {
            models.forEach(obj => {
                if (obj.SewingModelId === modelID) {
                    setDefaultFabricPhoto(obj.DefaultFabricPhotoUrl);
                    setDefaultModelName(obj.ModelENName)
                }
            });
            getFabrics();
        }
    }, [models]);
    
    useEffect(() => {
        if (modelID !== '' && catID !== '') {
            getCats();
        }
    }, [modelID, catID, pageLanguage, location.pathname]);
    
    useEffect(() => {
        if (Object.keys(fabrics).length) {
            renderFabrics();
        }
    }, [fabrics]);
    
    useEffect(() => {
        if (pageLanguage !== '') {
            setCatID(CatID);
            setModelID(ModelID);
        }
    }, [pageLanguage, location.pathname]);
    
    return (
        <div className="Custom_model_container">
            <div className="breadcrumb_container dir_ltr">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item" linkProps={{to: "/" + pageLanguage, className: "breadcrumb_item"}}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"
                                     linkProps={{
                                         to: "/" + pageLanguage + "/Curtain/" + catID,
                                         className: "breadcrumb_item breadcrumb_item_current"
                                     }}>{catID}</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} className="breadcrumb_item"
                                     linkProps={{to: location, className: "breadcrumb_item breadcrumb_item_current"}}>{defaultModelName}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            
            
            <div className="models_title_div">
                <h1>Custom Drapery</h1>
            </div>
            <div className="model_customize_container">
                <div className="model_customize_image">
                    <img src={`http://atlaspood.ir${defaultFabricPhoto}`} className="img-fluid" alt=""/>
                </div>
                <div className="model_customize_section">
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="0" stepNum="1" stepTitle="Fabric Material & Color" stepSelected=""/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <div className="card_body card-body-fabric">
                                        <div className="search_filter_container">
                                            <div className="search_container">
                                                <div className="search_box">
                                                    <input type="text" placeholder="Search for product Name/Code"
                                                           className="form-control search_input"
                                                           name="search_input" defaultValue=""
                                                           ref={search_input}
                                                           onChange={(e) => {
                                                               if (e.target.value !== "")
                                                                   setSearchShow(true);
                                                               else
                                                                   setSearchShow(false);
                                                           }}/>
                                                    {searchShow &&
                                                    <div className="clear-icon-container" onClick={() => {
                                                        search_input.current.value = "";
                                                        setSearchShow(false)
                                                    }}>
                                                        <i className="fa fa-times-circle clear-icon"/>
                                                    </div>
                                                    }
                                                    <div className="search-icon-container">
                                                        <i className="fa fa-search search-icon"/>
                                                    </div>
                                                </div>
                                                <button className="reset_filters">Reset Filters</button>
                                            </div>
                                            <div className="filters_container">
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            Color
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="Aqua"/>
                                                                    Aqua
                                                                </label>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="Beige"/>
                                                                    Beige
                                                                </label>
                                                            </Dropdown.Item>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter">Clear Filters</div>
                                                                <div className="done_inside_filter">Done</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            Pattern
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="Botanical/Florals"/>
                                                                    Botanical/Florals
                                                                </label>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="Chinoiserie"/>
                                                                    Chinoiserie
                                                                </label>
                                                            </Dropdown.Item>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter">Clear Filters</div>
                                                                <div className="done_inside_filter">Done</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            Type
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="Chenille"/>
                                                                    Chenille
                                                                </label>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="Chenille"/>
                                                                    Chenille
                                                                </label>
                                                            </Dropdown.Item>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter">Clear Filters</div>
                                                                <div className="done_inside_filter">Done</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="filter_container">
                                                    <Dropdown autoClose="outside" title="">
                                                        <Dropdown.Toggle className="dropdown_btn">
                                                            Price
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="$"/>
                                                                    $
                                                                </label>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="$$"/>
                                                                    $$
                                                                </label>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as={Button}>
                                                                <label className="dropdown_label">
                                                                    <input type="checkbox" value="$$$"/>
                                                                    $$$
                                                                </label>
                                                            </Dropdown.Item>
                                                            <div className="filter_inside_button_section">
                                                                <div className="clear_inside_filter">Clear Filters</div>
                                                                <div className="done_inside_filter">Done</div>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        {fabricsList}
                                        <Modal dialogClassName="zoomModal" show={show} onHide={() => handleClose()}>
                                            <Modal.Header closeButton>
                                                {/*<Modal.Title>Modal heading</Modal.Title>*/}
                                            </Modal.Header>
                                            <Modal.Body>{zoomModalBody}</Modal.Body>
                                            <Modal.Footer>
                                                <button className="swatchButton" current-state="0" onClick={e => fabricSwatch(e)}>ORDER SWATCH</button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Card.Header>
                                <ContextAwareToggle eventKey="1" stepNum="2" stepTitle="Mount Type" stepSelected=""/>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <div className="card_body card_body_radio">
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_inside.svg')} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" value="Inside" name="step2" ref-num="2" id="12A1" onClick={e => selectChanged(e)}/>
                                            <label htmlFor="12A1">Inside</label>
                                        </div>
                                        <div className="box50 radio_style">
                                            <img src={require('../Images/drapery/zebra/mount_outside.svg')} className="img-fluid" alt=""/>
                                            <input className="radio" type="radio" value="Outside" name="step2" ref-num="2" id="12A2" onClick={e => selectChanged(e)}/>
                                            <label htmlFor="12A2">Outside</label>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
            
            
            <div className="CustomModelFooter">
                <div className="CustomModelFooter_hidden_part"/>
                <div className="CustomModelFooter_visible_part">
                    <div className="left_footer">
                        <button className="save_to_acc">Save To<br/>My Account</button>
                    </div>
                    <div className="hidden_inner_footer">&nbsp;</div>
                    <div className="footer_price_section">
                        <div className="showPrice">Price</div>
                        <div className="price">0 TOMANS</div>
                    </div>
                    <div className="right_footer">
                        <input type="submit" className="btn add_to_cart" value="Add To Cart"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Zebra;