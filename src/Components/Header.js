import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as Logoen} from '../Images/public/logoen.svg';
import {ReactComponent as Logofa} from '../Images/public/logofa.svg';
import {ReactComponent as Favorite} from '../Images/public/favorite.svg';
import {ReactComponent as Person} from '../Images/public/person-2.svg';
import {ReactComponent as Basket} from '../Images/public/basket-2.svg';
import axios from "axios";
import {useTranslation} from "react-i18next";
import Modal from "react-bootstrap/Modal";
import {useDispatch, useSelector} from "react-redux";
import {HideLoginModal, LOGOUT, ShowLoginModal} from "../Actions/types";

const baseURLGet = "http://api.atlaspood.ir/WebsiteSetting/GetBanner?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLMenu = "http://api.atlaspood.ir/WebsiteMenu/GetByChildren?apikey=477f46c6-4a17-4163-83cc-29908d";
const baseURLGetPage = "http://api.atlaspood.ir/WebsitePage/GetById";


function Header() {
    const {t, i18n} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const {isLoggedIn, user, showLogin} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [banner, setBanner] = React.useState([]);
    const [bannerOneSlide, setBannerOneSlide] = React.useState([]);
    const [bannerItem, setBannerItem] = React.useState({
        text1: "", text2: "", url: "/", nextI: 0
    });
    const [bannerItemOneSlide, setBannerItemOneSlide] = React.useState([]);
    const [langLocation, setLangLocation] = React.useState({
        locationEN: "/en", locationFA: "/fa"
    });
    const [menu, setMenu] = React.useState([]);
    const [catMenu, setCatMenu] = React.useState([]);
    const [menuRender, setMenuRender] = React.useState([]);
    const [modals, setModals] = useState([]);
    const [currentPage, setCurrentPage] = useState({
        level1:"",
        level2:"",
        level3:""
    });
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
        remember: false
    });
    const [registerInfo, setRegisterInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirm: "",
        news:true
    });
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    const mega = useRef([]);
    
    
    function convertToPersian(string_farsi) {
        let tempString = string_farsi.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace("ي", "ی");
        tempString = tempString.replace('ك', 'ک');
        return tempString;
    }
    
    
    function getBanner() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            let temparr = [];
            arr.banner.forEach(obj => {
                if (obj["lang"] === location.pathname.split('').slice(1, 3).join('')) {
                    temparr = [...temparr, obj];
                }
            });
            if (temparr[0].oneSlide === "true") {
                setBannerOneSlide(temparr);
            } else
                setBanner(temparr);
        }).catch(err => {
            console.log(err);
        });
        
    }
    
    // function renderCatMenu() {
    //     let sortedMenu = [...menu];
    //     let promises = [];
    //     sortedMenu.forEach(obj => {
    //         let Children = obj.Children;
    //         Children.forEach(subObj => {
    //             let subChildren = subObj.Children;
    //             subChildren.forEach(subsubObj => {
    //                 let subSubWebsitePageId = subsubObj.WebsitePageId;
    //                 if (subSubWebsitePageId === null || subSubWebsitePageId === 0 || subSubWebsitePageId === undefined) {
    //                 } else {
    //                     promises.push(axios.get(baseURLGetPage, {
    //                             params: {
    //                                 WebsitePageId: subSubWebsitePageId,
    //                                 apiKey: window.$apikey
    //                             }
    //                         }).then((response) => {
    //                             subsubObj["subSubPageTypeId"] = response.data.PageTypeId;
    //                             subsubObj["subSubCategoryId"] = response.data.CategoryId;
    //                             // console.log("hi");
    //                         }).catch(err => {
    //                             console.log(err);
    //                         })
    //                     )
    //                 }
    //             });
    //         });
    //     });
    //     Promise.all(promises).then(() => {
    //         // console.log(sortedMenu);
    //         setCatMenu(sortedMenu);
    //     });
    //
    // }
    
    function renderBanner(bannerIndex) {
        if (bannerIndex === banner.length) bannerIndex = 0;
        let text1 = banner[bannerIndex].text1;
        let text2 = banner[bannerIndex].text2;
        let url = banner[bannerIndex].url;
        setBannerItem({text1: text1, text2: text2, url: url, nextI: bannerIndex + 1});
    }
    
    function renderBannerOneSlide() {
        const bannerList = [];
        for (let i = 0; i < bannerOneSlide.length; i++) {
            let text1 = bannerOneSlide[i].text1;
            let text2 = bannerOneSlide[i].text2;
            let url = bannerOneSlide[i].url;
            let fontSize = bannerOneSlide[i].fontSize;
            
            bannerList.push(
                <Link className="banner_oneSlide_item_container" key={"banner" + i} to={"/" + url} style={{fontSize: fontSize + "px"}}>
                    <div className={`banner_oneSlide_item ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <span>{text1}</span>&nbsp;
                        <span className="text_underline">{text2}</span>
                    </div>
                </Link>
            );
            if (i !== bannerOneSlide.length - 1)
                bannerList.push(
                    <span key={"banner_seperator" + i} className="banner_seperator">
                        &nbsp;|&nbsp;
                    </span>
                );
        }
        setBannerItemOneSlide(bannerList);
    }
    
    async function getMenu() {
        axios.get(baseURLMenu).then((response) => {
            let arr = response.data;
            setMenu(arr);
        }).catch(err => {
            console.log(err);
        });
    }
    
    function renderMenu() {
        let pageLanguage = location.pathname.split('').slice(1, 3).join('');
        
        let sortedMenu = [];
        for (let i = 0; i < menu.length; i++) {
            sortedMenu[menu[i].MenuOrder] = menu[i];
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
        
        // let sortedCatMenu=[...sortedMenu];
        // sortedMenu.forEach(obj => {
        //     let Children = obj.Children;
        //     Children.forEach(subObj => {
        //         let subChildren = subObj.Children;
        //         subChildren.forEach(subsubObj => {
        //             let subSubWebsitePageId = subsubObj.WebsitePageId;
        //             if (subSubWebsitePageId === null || subSubWebsitePageId === 0 || subSubWebsitePageId === undefined)
        //                 subSubWebsitePageId = 40;
        //             axios.get(baseURLGetPage, {
        //                 params: {
        //                     WebsitePageId: subSubWebsitePageId,
        //                     apiKey: window.$apikey
        //                 }
        //             }).then((response) => {
        //                 subsubObj["subSubPageTypeId"] = response.data.PageTypeId;
        //                 subsubObj["subSubCategoryId"] = response.data.CategoryId;
        //             }).catch(err => {
        //                 console.log(err);
        //             });
        //         });
        //     });
        // });
        //
        
        const menuList = [];
        for (let i = 0; i < sortedMenu.length; i++) {
            let MenuName = convertToPersian(sortedMenu[i].MenuName);
            let MenuEnName = sortedMenu[i].MenuEnName;
            let IsActive = sortedMenu[i].IsActive;
            let WebsitePageId = sortedMenu[i].WebsitePageId;
            let Children = sortedMenu[i].Children;
            
            const buffer = [];
            const subMenuList = [];
            for (let j = 0; j < Children.length; j++) {
                let subMenuName = convertToPersian(Children[j].MenuName);
                let subMenuEnName = Children[j].MenuEnName;
                let subIsActive = Children[j].IsActive;
                let subWebsitePageId = Children[j].WebsitePageId;
                let subChildren = Children[j].Children;
                let subWidth = Children[j].Width;
                
                if (subChildren.length === 0) {
                    buffer.push(
                        <h1 key={"subMenu" + i + j + "noChild" + "title"}
                            className="subMenu_title"
                            style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    );
                    //
                    // if (subChildren.length === 0) {
                    //     subMenuList.push(
                    //         <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + j}>
                    //             <h1 key={"subMenu" + i + j + "noChild" + "title"}
                    //                 className={`subMenu_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                    //                 style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    //         </div>
                    //     );
                    //
                } else {
                    
                    buffer.push(
                        <h1 key={"subMenu" + i + j + "title"}
                            className="subMenu_title"
                            style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    );
                    
                    let empty_fields = 0;
                    for (let k = 0; k < subChildren.length; k++) {
                        let subSubMenuName = convertToPersian(subChildren[k].MenuName);
                        let subSubMenuEnName = subChildren[k].MenuEnName;
                        let subSubIsActive = subChildren[k].IsActive;
                        let subSubWebsitePageId = subChildren[k].WebsitePageId;
                        let subSubChildren = subChildren[k].Children;
                        let subSubWidth = subChildren[k].Width;
                        let subSubPageTypeId = subChildren[k].PageTypeId;
                        let subSubCategoryId = subChildren[k].PageName;
                        
                        
                        let subSubPageType = subSubPageTypeId === 5501 ? "Product" : "Curtain";
                        
                        
                        //
                        // if (k === 0) {
                        //     subSubMenuList.push(
                        //         <h1 key={"subMenu" + i + j + k + "title"}
                        //             className={`subMenu_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                        //             style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                        //     );
                        // }
                        
                        if (subSubMenuEnName === "") {
                            empty_fields++;
                        } else {
                            buffer.push(
                                <h2 key={"subSubMenu" + i + j + k}>
                                    <Link className="subSubMenu"
                                          to={"/" + pageLanguage + "/" + subSubPageType + "/" + subSubCategoryId}
                                          onClick={() => menuClicked(i)}>{pageLanguage === 'en' ? subSubMenuEnName : subSubMenuName}</Link>
                                </h2>);
                            
                            // subSubMenuList.push(
                            //     <h2 key={"subSubMenu" + i + j + k}>
                            //         <Link className={`subSubMenu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                            //               to={"/" + pageLanguage + "/" + subSubPageType + "/" + subSubCategoryId}>{pageLanguage === 'en' ? subSubMenuEnName : subSubMenuName}</Link>
                            //     </h2>);
                        }
                    }
                    for (let emptyCounter = 0; emptyCounter < empty_fields; emptyCounter++) {
                        buffer.push(
                            <h2 key={"subSubMenu" + i + j + "empty" + emptyCounter} className="emptySubMenu">
                                &nbsp;
                            </h2>);
                        
                        // subSubMenuList.push(
                        //     <h2 key={"subSubMenu" + i + j + "empty" + emptyCounter}>
                        //
                        //     </h2>);
                    }
                    
                    
                    // if (j + 1 < Children.length) {
                    //     if (subSubMenuList.length + (Children[j + 1].Children).length > 10) {
                    //         subMenuList.push(
                    //             <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + j}>
                    //                 {subSubMenuList}
                    //             </div>);
                    //         subSubMenuList = [];
                    //     }
                    // } else {
                    //     subMenuList.push(
                    //         <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + j}>
                    //             {subSubMenuList}
                    //         </div>);
                    //     subSubMenuList = [];
                    // }
                }
            }
            
            for (let m = 0; m < buffer.length; m += 13) {
                let subSubMenuList = [];
                for (let n = m; n < m + 13; n++) {
                    if (n === buffer.length)
                        break;
                    else {
                        subSubMenuList.push(buffer[n]);
                    }
                }
                subMenuList.push(
                    <div className="cel-top-menu" key={"subMenu" + i + m}>
                        {subSubMenuList}
                    </div>
                );
            }
            
            // console.log(buffer.length);
            
            
            menuList.push(
                <li key={"menu" + i}>
                    <h1>{pageLanguage === 'en' ? MenuEnName : MenuName}</h1>
                    <div ref={ref => (mega.current[i] = ref)} className="mega" style={{display: 'none'}}>
                        <div className="sub_menu">
                            {subMenuList}
                        </div>
                    </div>
                </li>);
        }
        setMenuRender(menuList);
    }
    
    function menuClicked(index) {
        mega.current[index].className = "mega1";
        setTimeout(() => {
            mega.current[index].className = "mega";
        }, 1000);
        // console.log(mega.current[index])
    }
    
    async function setLang() {
        const tempLocationEn = location.pathname.split('');
        tempLocationEn[1] = 'e';
        tempLocationEn[2] = 'n';
        tempLocationEn.join('');
        
        const tempLocationFa = location.pathname.split('');
        tempLocationFa[1] = 'f';
        tempLocationFa[2] = 'a';
        
        setLangLocation({locationEN: tempLocationEn.join(''), locationFA: tempLocationFa.join('')});
        
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
    }
    
    function modalHandleClose(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = false;
        setModals(tempModals);
    }
    
    function modalHandleShow(modalName) {
        let tempModals = [...modals];
        tempModals[modalName] = true;
        setModals(tempModals);
    }
    
    useEffect(() => {
        setLang().then(() => {
            if (pageLanguage !== '') {
                // setBannerItem({
                //     text1: "", text2: "", url: "/", nextI: 0
                // });
                // setBannerItemOneSlide([]);
                // setMenuRender([]);
                // setTimeout(() => {  console.log("World!"); }, 2000);
                // i18n.changeLanguage(pageLanguage);
                // getMenu().then(() => {
                //     getBanner();
                // });
            }
        });
        let currentPageInfo=JSON.parse(JSON.stringify(currentPage));
        currentPageInfo.level1=location.pathname.split("/")[2];
        currentPageInfo.level2=location.pathname.split("/")[3];
        currentPageInfo.level3=location.pathname.split("/")[4];
        // console.log(currentPageInfo.level3);
        setCurrentPage(currentPageInfo);
        
        
        
    }, [location.pathname]);
    
    useEffect(() => {
        setBannerItem({
            text1: "", text2: "", url: "/", nextI: 0
        });
        setBannerItemOneSlide([]);
        setMenuRender([]);
        if (pageLanguage !== '') {
            i18n.changeLanguage(pageLanguage);
            getMenu().then(() => {
                getBanner();
            });
            document.body.dir = pageLanguage === 'fa' ? "rtl" : "ltr";
            document.body.className = pageLanguage === 'fa' ? "font_farsi" : "font_en";
            // document.querySelectorAll("html  , body  , div  , span  , applet  , object  , iframe  , h1  , h2  , h3  , h4  , h5  , h6  , p  , blockquote  , pre  , a  , abbr  , acronym  , address  , big  , cite  , code  , del  , dfn  , em  , img  , ins  , kbd  , q  , s  , samp  , small  , strike  , strong  , sub  , sup  , tt  , var  , b  , u  , i  , center  , dl  , dt  , dd  , ol  , ul  , li  , fieldset  , form  , label  , legend  , table  , caption  , tbody  , tfoot  , thead  , tr  , th  , td  , article  , aside  , canvas  , details  , embed  , figure  , figcaption  , footer  , header  , hgroup  , menu  , nav  , output  , ruby  , section  , summary  , time  , mark  , audio  , video").forEach(obj => {
            //     if (pageLanguage === 'fa')
            //         obj.classList.add("font_farsi");
            //     else if (pageLanguage === 'en')
            //         obj.classList.remove("font_farsi");
            // });
        }
        
    }, [pageLanguage]);
    
    useEffect(() => {
        if (banner.length && pageLanguage !== '') {
            renderBanner(0)
        }
    }, [banner]);
    
    useEffect(() => {
        if (menu.length) {
            renderMenu()
        }
    }, [menu]);
    
    // useEffect(() => {
    //     if (catMenu.length) {
    //         renderMenu()
    //     }
    // }, [catMenu]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (bannerItem.text1.length) {
                renderBanner(bannerItem.nextI)
            }
        }, 4500);
        
        return () => clearTimeout(timeout)
        
    }, [bannerItem]);
    
    useEffect(() => {
        if (bannerOneSlide.length !== 0 && pageLanguage !== '') {
            renderBannerOneSlide();
            // console.log(bannerOneSlide)
        }
    }, [bannerOneSlide]);
    
    return (
        <div className={`header_container padding-clear ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
            <div className="top_header">
                <div className="col-lg-12">
                    <div className="top_title">
                        {bannerItemOneSlide.length === 0 &&
                        <Link to={"/" + bannerItem.url}>
                            <span>{bannerItem.text1}</span>&nbsp;
                            <span className="text_underline">{bannerItem.text2}</span>
                        </Link>
                        }
                        {bannerItemOneSlide.length !== 0 &&
                        bannerItemOneSlide
                        }
                    </div>
                </div>
            </div>
            <div className="mid_header">
                <div className="col-lg-12">
                    <div className="mid_header_left">
                        <div className="search-box">
                            <button className="btn-search">
                                <img src={require('../Images/public/main_search_icon.svg')}
                                     className="img-fluid" alt=""/>
                                <input type="text" className={`input-search ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} placeholder={t("Search_placeholder")} autoComplete="new-search"/>
                            </button>
                        </div>
                    </div>
                    <div className="Logo"><Link to="/">{pageLanguage === 'en' ? <Logoen/> : <Logofa/>}</Link></div>
                    <div className="mid_header_right">
                        <ul className={pageLanguage === 'fa' ? "float_left icons" : "float_right icons"}>
                            {currentPage.level1 === "Curtain" && currentPage.level3 !== undefined &&
                            <li className="login-open" onClick={() => {
                                if(isLoggedIn) {
                                    navigate("/" + pageLanguage+"/Account");
                                }
                                else{
                                    dispatch({
                                        type: ShowLoginModal,
                                    })
                                }
                            }}>
                                <Person/>
                            </li>
                            }
                            {!(currentPage.level1 === "Curtain" && currentPage.level3 !== undefined) &&
                            <Link className="login-open" to={isLoggedIn? "/" + pageLanguage+"/Account":"/" + pageLanguage +"/User"}><Person/></Link>
                            }
                            <li className="favorite">
                                <a href="https://www.doopsalta.com/en/account/login/">
                                    <Favorite/>
                                </a>
                            </li>
                            <li className="checkout">
                                <Link to={"/" + pageLanguage + "/Basket"}>
                                    <div className="display_grid">
                                        <Basket/>
                                        <div className="count">0</div>
                                    </div>
                                </Link>
                                <div className="card_menu">
                                    <div className="card_menu_title">
                                        <span>Shopping Bag</span>
                                    </div>
                                    <Link className="card_button" to="/">Swatches (<span id="swatch">0</span>)</Link>
                                    <Link className="card_button" to="/">Product (<span id="procount">0</span>)</Link>
                                    <Link className="card_button" to="/">Go To Bag</Link>
                                </div>
                            </li>
                        </ul>
                        <ul className={`Lang_change_container ${pageLanguage === 'fa' ? "float_left" : "float_right"}`}>
                            <li className="Lang_change">
                                <Link to={langLocation.locationEN} onClick={() => i18n.changeLanguage("en")}
                                      style={pageLanguage === 'en' ? {pointerEvents: "none", color: "#383838"} : null}>ENGLISH</Link>
                            </li>
                            <li className="lang_separator">&nbsp;|&nbsp;</li>
                            <li className="Lang_change">
                                <Link to={langLocation.locationFA} onClick={() => i18n.changeLanguage("fa")}
                                      style={pageLanguage === 'fa' ? {pointerEvents: "none", color: "#383838"} : null}>فارسی</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bottom_header">
                <div className="col-lg-12">
                    <div className="menu">
                        <ul>
                            {menuRender}
                        </ul>
                        <div className="bghover">
                        </div>
                    </div>
                </div>
            </div>
            
            
            {/* Modals */}
            
            <Modal backdrop="static" keyboard={false} dialogClassName={`login_modal fullSizeModal login_page_container ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                   show={showLogin}
                   onHide={() => dispatch({
                       type: HideLoginModal,
                   })}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="logo_container">
                        <div className="Logo">
                            <Link to="/">{pageLanguage === 'en' ? <Logoen/> : <Logofa/>}</Link>
                        </div>
                    </div>
                    <div className="login_register_container">
                        <div className="login_container">
                            <div className="login_inside_container">
                                <h1 className="login_title">SIGN IN TO YOUR ACCOUNT</h1>
                                <input type="text" placeholder={t("Email Address*")} className="form-control" name="Email" value={loginInfo.email}
                                       onChange={(e) => {
                                           let temp = JSON.parse(JSON.stringify(loginInfo));
                                           temp.email = e.target.value;
                                           setLoginInfo(temp);
                                       }}/>
                                <input type="password" placeholder={t("Password*")} className="form-control form-control-password" name="Password" value={loginInfo.password}
                                       onChange={(e) => {
                                           let temp = JSON.parse(JSON.stringify(loginInfo));
                                           temp.password = e.target.value;
                                           setLoginInfo(temp);
                                       }}/>
                                <div className="remember_forgot_container">
                                    <div className="remember_container">
                                        <label className="remember_label">
                                            <input type="checkbox" value={loginInfo.remember}
                                                   onChange={(e) => {
                                                       let temp = JSON.parse(JSON.stringify(loginInfo));
                                                       temp.remember = e.target.value;
                                                       setLoginInfo(temp);
                                                   }}/>
                                            Remember Me
                                        </label>
                                    </div>
                                    <div className="forgot text_underline">Forgot your password?</div>
                                </div>
                                <div className="login_btn_container">
                                    {/*<button className="login_btn btn btn-new-dark">SIGN IN</button>*/}
                                    <Link to={"/" + pageLanguage + "/Account"} className="login_btn btn btn-new-dark">SIGN IN</Link>
                                </div>
                            </div>
                        </div>
                        <div className="register_container">
                            <div className="register_inside_container">
                                <h1 className="login_title">CREATE AN ACCOUNT</h1>
                                <p className="login_text">Create an account and enjoy:</p>
                                <ul className="register_list">
                                    <li className="register_list_item">Easier order tracking</li>
                                    <li className="register_list_item">Speedier Checkout</li>
                                    <li className="register_list_item">Saved payment and shipping information</li>
                                </ul>
                                {!showRegister && <button className="register_btn btn" onClick={() => setShowRegister(true)}>LET'S GO</button>}
                                {showRegister && <div className="register_section_container">
                                    <div className="register_section_item">
                                        <input type="text" placeholder={t("First Name*")} className="form-control" name="Email" value={registerInfo.firstName}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(registerInfo));
                                                   temp.firstName = e.target.value;
                                                   setRegisterInfo(temp);
                                               }}/>
                                    </div>
                                    <div className="register_section_item">
                                        <input type="text" placeholder={t("Last Name*")} className="form-control" name="Email" value={registerInfo.lastName}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(registerInfo));
                                                   temp.lastName = e.target.value;
                                                   setRegisterInfo(temp);
                                               }}/>
                                    </div>
                                    <div className="register_section_item">
                                        <input type="text" placeholder={t("Email Address*")} className="form-control" name="Email" value={registerInfo.email}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(registerInfo));
                                                   temp.email = e.target.value;
                                                   setRegisterInfo(temp);
                                               }}/>
                                    </div>
                                    <div className="register_section_item">
                                        <input type="number" placeholder={t("Mobile Number (Optional)")} className="form-control" name="Email" value={registerInfo.phone}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(registerInfo));
                                                   temp.phone = e.target.value;
                                                   setRegisterInfo(temp);
                                               }}/>
                                    </div>
                                    <div className="register_section_item">
                                        <input type="password" placeholder={t("Password*")} className="form-control form-control-password" name="Register_Password"
                                               value={registerInfo.password}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(registerInfo));
                                                   temp.password = e.target.value;
                                                   setRegisterInfo(temp);
                                                   if (temp.password === temp.passwordConfirm)
                                                       setPasswordMatch(true);
                                                   else
                                                       setPasswordMatch(false);
                                               }}/>
                                    </div>
                                    <div className="register_section_item">
                                        <input type="password" placeholder={t("Confirm Password*")} className="form-control form-control-password" name="Register_PasswordConfirm"
                                               value={registerInfo.passwordConfirm}
                                               onChange={(e) => {
                                                   let temp = JSON.parse(JSON.stringify(registerInfo));
                                                   temp.passwordConfirm = e.target.value;
                                                   setRegisterInfo(temp);
                                                   if (temp.password === temp.passwordConfirm)
                                                       setPasswordMatch(true);
                                                   else
                                                       setPasswordMatch(false);
                                               }}/>
                                    </div>
                                    <div className="news_signup">
                                        <label className="news_signup_label">
                                            <input type="checkbox" checked={registerInfo.news}
                                                   onChange={(e) => {
                                                       let temp = JSON.parse(JSON.stringify(registerInfo));
                                                       temp.news = e.target.checked;
                                                       setRegisterInfo(temp);
                                                   }}/>
                                            Sign-up to be the first to know about new collections, exclusive sales and special events.
                                        </label>
                                    </div>
                                    <div className="login_btn_container">
                                        <button className="login_btn btn btn-new-dark">CREATE AN ACCOUNT</button>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        
        </div>
    
    
    );
}

export default Header;
