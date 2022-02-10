import React, {useEffect, useRef} from "react";
import {Link, useLocation} from "react-router-dom";
import {ReactComponent as Logoen} from '../Images/public/logoen.svg';
import {ReactComponent as Logofa} from '../Images/public/logofa.svg';
import axios from "axios";
import {FormControl, InputGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const baseURLGet = "http://atlaspood.ir/api/WebsiteSetting/GetBanner?apiKey=477f46c6-4a17-4163-83cc-29908d";
const baseURLMenu = "http://atlaspood.ir/api/WebsiteMenu/GetByChildren?apikey=477f46c6-4a17-4163-83cc-29908d";


function Header() {
    const {t, i18n} = useTranslation();
    const location = useLocation();
    const [banner, setBanner] = React.useState([]);
    const [bannerOneSlide, setBannerOneSlide] = React.useState([]);
    const [bannerItem, setBannerItem] = React.useState({
        text1: "", text2: "", url: "/", nextI: 0
    });
    const [bannerItemOneSlide, setBannerItemOneSlide] = React.useState([]);
    const [langLocation, setLangLocation] = React.useState({
        locationEN: "/en", locationFA: "/fa"
    });
    const [pageLanguage, setPageLanguage] = React.useState("");
    const [menu, setMenu] = React.useState([]);
    const [menuRender, setMenuRender] = React.useState([]);
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
        const menuList = [];
        for (let i = 0; i < sortedMenu.length; i++) {
            let MenuName = convertToPersian(sortedMenu[i].MenuName);
            let MenuEnName = sortedMenu[i].MenuEnName;
            let IsActive = sortedMenu[i].IsActive;
            let CategoryId = sortedMenu[i].CategoryId;
            let PageType = sortedMenu[i].PageType;
            let PageTypeId = sortedMenu[i].PageTypeId;
            let Children = sortedMenu[i].Children;
            
            const buffer = [];
            const subMenuList = [];
            for (let j = 0; j < Children.length; j++) {
                let subMenuName = convertToPersian(Children[j].MenuName);
                let subMenuEnName = Children[j].MenuEnName;
                let subIsActive = Children[j].IsActive;
                let subCategoryId = Children[j].CategoryId;
                let subPageType = Children[j].PageType;
                let subPageTypeId = Children[j].PageTypeId;
                let subChildren = Children[j].Children;
                let subWidth = Children[j].Width;
                
                if (subChildren.length === 0) {
                    buffer.push(
                        <h1 key={"subMenu" + i + j + "noChild" + "title"}
                            className={`subMenu_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
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
                            className={`subMenu_title ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                            style={{width: subWidth + "px"}}>{pageLanguage === 'en' ? subMenuEnName : subMenuName}</h1>
                    );
                    
                    let empty_fields = 0;
                    for (let k = 0; k < subChildren.length; k++) {
                        let subSubMenuName = convertToPersian(subChildren[k].MenuName);
                        let subSubMenuEnName = subChildren[k].MenuEnName;
                        let subSubIsActive = subChildren[k].IsActive;
                        let subSubCategoryId = subChildren[k].CategoryId;
                        let subSubPageTypeId = subChildren[k].PageTypeId;
                        let subSubChildren = subChildren[k].Children;
                        let subSubWidth = subChildren[k].Width;
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
                                <h2 key={"subSubMenu" + i + j + k} className={`${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                                    <Link className={`subSubMenu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}
                                          to={"/" + pageLanguage + "/" + subSubPageType + "/" + subSubCategoryId}
                                    onClick={()=>menuClicked(i)}>{pageLanguage === 'en' ? subSubMenuEnName : subSubMenuName}</Link>
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
                            <h2 key={"subSubMenu" + i + j + "empty" + emptyCounter} className={`${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
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
                    <div className={`cel-top-menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} key={"subMenu" + i + m}>
                        {subSubMenuList}
                    </div>
                );
            }
            
            // console.log(buffer.length);
            
            
            menuList.push(
                <li key={"menu" + i}>
                    <h1 className={`${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{pageLanguage === 'en' ? MenuEnName : MenuName}</h1>
                    <div ref={ref => (mega.current=[...mega.current, ref])} className={`mega ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} style={{display: 'none'}}>
                        <div className={`sub_menu ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                            {subMenuList}
                        </div>
                    </div>
                </li>);
        }
        setMenuRender(menuList);
    }
    
    function menuClicked(index){
        pageLanguage === 'fa' ? mega.current[index].className="mega1 font_farsi" : mega.current[index].className="mega1 font_en";
        setTimeout(() => { pageLanguage === 'fa' ? mega.current[index].className="mega font_farsi" : mega.current[index].className="mega font_en";  }, 1000);
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
            document.querySelectorAll("html  , body  , div  , span  , applet  , object  , iframe  , h1  , h2  , h3  , h4  , h5  , h6  , p  , blockquote  , pre  , a  , abbr  , acronym  , address  , big  , cite  , code  , del  , dfn  , em  , img  , ins  , kbd  , q  , s  , samp  , small  , strike  , strong  , sub  , sup  , tt  , var  , b  , u  , i  , center  , dl  , dt  , dd  , ol  , ul  , li  , fieldset  , form  , label  , legend  , table  , caption  , tbody  , tfoot  , thead  , tr  , th  , td  , article  , aside  , canvas  , details  , embed  , figure  , figcaption  , footer  , header  , hgroup  , menu  , nav  , output  , ruby  , section  , summary  , time  , mark  , audio  , video").forEach(obj => {
                if (pageLanguage === 'fa')
                    obj.classList.add("font_farsi");
                else if (pageLanguage === 'en')
                    obj.classList.remove("font_farsi");
            });
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
    
    return (<div className="header_container padding-clear ">
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
                            <input type="text" className={`input-search ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} placeholder={t("Search_placeholder")}/>
                        </button>
                    </div>
                </div>
                <div className="Logo"><Link to="/">{pageLanguage === 'en' ? <Logoen/> : <Logofa/>}</Link></div>
                <div className="mid_header_right">
                    <ul className={pageLanguage === 'fa' ? "float_left" : "float_right"}>
                        <li id="login-open">
                            <a href="http://www.doopsalta.com/en/account/login/">
                                <img src={require('../Images/public/person.svg')} className="img-fluid" alt=""/>
                            </a>
                        </li>
                        <li className="checkout">
                            <a href="http://www.doopsalta.com/en/basket/">
                                <div className="display_grid">
                                    <img src={require('../Images/public/basket.svg')} className="img-fluid" alt=""/>
                                    <div id="count">0</div>
                                </div>
                            </a>
                            <div className="card_menu">
                                <div className="card_menu_title">
                                    <span>Shopping Cart</span>
                                </div>
                                <Link className="card_button" to="/">Swatches (<span id="swatch">0</span>)</Link>
                                <Link className="card_button" to="/">Product (<span id="procount">0</span>)</Link>
                                <Link className="card_button" to="/">Go To Cart</Link>
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
    </div>);
}

export default Header;
