import React, {useEffect} from "react";
import Alert from 'react-bootstrap/Alert';
import axios from "axios";
import {InputGroup, FormControl, Toast, ToastContainer} from "react-bootstrap"
import {ReactComponent as noImage} from '../Images/public/no_image.svg';
import Draggable from "react-draggable";

const baseURLGet = "http://atlaspood.ir/api/WebsiteSetting/GetSlider?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLPost = "http://atlaspood.ir/api/WebsiteSetting/SaveSlider";

function Slideshow() {
    const [slide, setslide] = React.useState([]);
    const [slideList, setslideList] = React.useState([]);
    const [showToast, setShowToast] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(require('../Images/public/no_image.svg'));
    
    async function getslide() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            setslide(arr.slide);
        }).catch(err => {
            console.log(err);
        });
        
    }
    
    function renderslide() {
        const slideLists = [];
        for (let i = 0; i < slide.length; i++) {
            let url = slide[i].url;
            
            slideLists.push(<li key={"slide" + i} slide_id={i}>
                <div>
                    <Draggable>
                        <div>Draggable Text</div>
                    </Draggable>
                    <img src={selectedFile} className="img-fluid" alt=""/>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={e => updatePicture(e)}
                />
                <div>
                    <label className="input">
                        <input type="text" slide_text_id="text1" slide_id={i} defaultValue="New Text1" onChange={e => textChanged(e)} placeholder="Type Something..."/>
                        <span className="input__label">First Text</span>
                    </label>
                    <label className="input">
                        <input type="text" slide_text_id="text2" slide_id={i} defaultValue="New Text2" onChange={e => textChanged(e)} placeholder="Type Something..."/>
                        <span className="input__label">Second Text</span>
                    </label>
                    <label className="input">
                        <input type="text" slide_text_id="text2" slide_id={i} defaultValue="New Text3" onChange={e => textChanged(e)} placeholder="Type Something..."/>
                        <span className="input__label">Third Text</span>
                    </label>
                </div>
            </li>);
        }
        setslideList(slideLists);
    }
    
    function updatePicture(e) {
        let file = e.target.files[0];
        setSelectedFile(URL.createObjectURL(file));
    }
    
    function updateslide() {
        let postslidesArray = {};
        postslidesArray["Value"] = {};
        postslidesArray["Value"]["slide"] = slide;
        postslidesArray["ApiKey"] = window.$apikey;
        axios.post(baseURLPost, postslidesArray)
            .then(() => {
                setShowToast(true);
            }).catch(err => {
            console.log(err);
        });
    }
    
    function addslide() {
        const tempslide = [...slide];
        tempslide[slide.length] = {"text1": '', "text2": ''};
        setslide(tempslide);
    }
    
    function deleteslide() {
        const tempslide = [...slide];
        if (slide.length > 1) tempslide.pop();
        setslide(tempslide);
    }
    
    function textChanged(e) {
        const tempslide = [...slide];
        tempslide[e.target.getAttribute('slide_id')][e.target.getAttribute('slide_text_id')] = e.target.value;
        setslide(tempslide);
    }
    
    useEffect(() => {
        getslide();
    }, []);
    
    useEffect(() => {
        if (slide.length) {
            renderslide()
        }
    }, [slide, selectedFile]);
    
    
    return (<div className="slideshow_page_container">
        <h1 className="slide_title">Slides List</h1>
        <div className="slides">
            <ul className="slides_list">
                {slideList}
            </ul>
            <button className="btn btn-success admin_panel_button" onClick={() => {
                addslide()
            }}>Add
            </button>
            <button className="btn btn-danger admin_panel_button" onClick={() => {
                deleteslide()
            }}>Delete Last
            </button>
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

export default Slideshow;