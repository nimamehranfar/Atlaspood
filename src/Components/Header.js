import React, {useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {ReactComponent as Logo} from '../Images/public/logoen.svg';
import axios from "axios";
import i18next from "i18next";

const baseURLGet = "http://atlaspood.ir/api/WebsiteSetting/GetBanner?apiKey=477f46c6-4a17-4163-83cc-29908d";


function Header() {
    const location = useLocation();
    const [banner, setBanner] = React.useState([]);
    const [bannerItem, setBannerItem] = React.useState({
        text1: "", text2: "", url: "/", nextI: 0
    });
    const [langLocation, setLangLocation] = React.useState({
        locationEN: "/en", locationFA: "/fa"
    });
    
    async function getBanner() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            setBanner(arr.banner);
        }).catch(err => {
            console.log(err);
        });
        
    }
    
    async function renderBanner(bannerIndex) {
        if (bannerIndex === banner.length) bannerIndex = 0;
        let text1 = banner[bannerIndex].text1;
        let text2 = banner[bannerIndex].text2;
        let url = banner[bannerIndex].url;
        setBannerItem({text1: text1, text2: text2, url: url, nextI: bannerIndex + 1});
    }
    
    useEffect(() => {
        getBanner();
        
        const tempLocationEn = location.pathname.split('');
        tempLocationEn[1] = 'e';
        tempLocationEn[2] = 'n';
        tempLocationEn.join('');
        
        const tempLocationFa = location.pathname.split('');
        tempLocationFa[1] = 'f';
        tempLocationFa[2] = 'a';
        
        setLangLocation({locationEN: tempLocationEn.join(''), locationFA: tempLocationFa.join('')});
    }, []);
    
    useEffect(() => {
        if (banner.length) {
            renderBanner(0)
        }
    }, [banner]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (bannerItem.text1.length) {
                renderBanner(bannerItem.nextI)
            }
        }, 4500);
        
        return () => clearTimeout(timeout)
        
    }, [bannerItem]);
    
    return (<div className="header_container padding-clear ">
        <div className="top_header">
            <div className="col-lg-12">
                <div className="top_title">
                    <Link to={"/" + bannerItem.url}>
                        <span>{bannerItem.text1}</span>
                        <span className="text_underline">{bannerItem.text2}</span>
                    </Link>
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
                            <input type="text" className="input-search" placeholder="SEARCH"/>
                        </button>
                    </div>
                </div>
                <div className="Logo"><Link to="/"><Logo/></Link></div>
                <div className="mid_header_right">
                    <ul>
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
                    <ul className="Lang_change_container">
                        <li className="Lang_change">
                            <Link to={langLocation.locationEN}  onClick={() => i18next.changeLanguage("en")}>EN</Link>
                        </li>
                        <li className="Lang_change">
                            <Link to={langLocation.locationFA}  onClick={() => i18next.changeLanguage("fa")}>FA</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="bottom_header">
            <div className="col-lg-12">
                <div className="menu">
                    <ul>
                        <li><a>WINDOW TREATMENTS</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu">
                                        <h1><a> Drapery</a></h1>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/blind/custom/3A60298/">Custom
                                            Drapery</a>
                                        </h2>
                                        <h2><a href="http://www.doopsalta.com/en/blind/custom/15BD736/">Readymade
                                            Drapery</a>
                                        </h2>
                                        <h1><a>Custom Shades</a></h1>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat/100401/Roman-Shades/">Roman
                                            Shades</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/blind/custom/371825D/">Roller
                                            Shades</a>
                                        </h2>
                                        <h2><a href="http://www.doopsalta.com/en/blind/custom/8EBFAB3/">Dual
                                            Roller Shade</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/blind/custom/9607BD5/">Zebra
                                            Shades</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/blind/custom/0561204/">DK</a>
                                        </h2>
                                        <h2
                                        ><a href="http://www.doopsalta.com/en/blind/custom/BA4CF0A/">Panel
                                            Track Shades</a>
                                        </h2>
                                    </div>
                                    
                                    <div className="cel-top-menu"><h1><a>Custom Blinds</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/100301/Wood-Blinds/">Wood
                                        Blinds</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/blind/custom/B6483D8/">Metal Blinds</a>
                                    </h2><h1><a>Decorative Treatments</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/100501/Valances/">Valances</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/blind/custom/635C937/">Cornices</a></h2>
                                        <h1><a>Drapery Hardware</a></h1><h2><a
                                            href="http://www.doopsalta.com/en/blind/custom/06B1E96/">Metal
                                            Hardware</a></h2><h2><a
                                            href="http://www.doopsalta.com/en/product/cat/100602/Wood-Hardware/">Wood
                                            Hardware</a></h2><h2/>
                                    </div>
                                    
                                    <div className="cel-top-menu"><h1><a>Drapery Accessories</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/100701/Tiebacks/">Tiebacks</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/blind/custom/417CBAA/">Tassels</a></h2><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/100703/Fringe/">Fringe</a>
                                    </h2>
                                    </div>
                                
                                </div>
                            </div>
                        </li>
                        <li><a>FURNITURE</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu"><h1><a>Living Room</a></h1><h2>
                                        <a href="http://www.doopsalta.com/en/product/cat/200101/Sofas/">Sofas</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200102/Sectional-Sofas/">Sectional
                                        Sofas</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200103/Chairs/">Chairs</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200104/Ottomans/">Ottomans</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200105/Side-Tables/">Side
                                        Tables</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200106/Coffee-Tables/">Coffee
                                        Tables</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200107/Consoles/">Consoles</a>
                                    </h2><h2/><h2/></div>
                                    <div className="cel-top-menu"><h1><a>Dining</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200201/Dining-Tables/">Dining
                                        Tables</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200202/Dining-Chairs/">Dining
                                        Chairs</a></h2><h1><a>Bedroom</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200301/Beds/">Beds</a></h2><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/200302/Nightstands/">Nightstands</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200303/Dressers/">Dressers</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200304/Shelves/">Shelves</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200305/Occasional-Chairs/">Occasional
                                        Chairs</a></h2><h2/></div>
                                    <div className="cel-top-menu"><h1><a>Pre Teen Bedroom</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/200401/Beds/">Beds</a></h2><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/200402/Nightstands/">Nightstands</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/200403/Dressers/">Dressers</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/blind/custom/318E405/">Desks</a></h2><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/200405/Shelves/">Shelves</a>
                                    </h2></div>
                                </div>
                            </div>
                        </li>
                        <li><a>BED &amp; BATH</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu"><h1><a>Bedding</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/all/3001/All-Bedding/">All
                                        Bedding</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300101/Duvet-Cover-Sets/">Duvet
                                        Cover Sets</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300102/Comforter-Sets/">Comforter
                                        Sets</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300103/Coverlet-sets/">Coverlet
                                        sets</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300104/Sheet-Sets/">Sheet
                                        Sets</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300108/Pillowcases/">Pillowcases</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300105/Decorative-Pillows/">Decorative
                                        Pillows</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300106/Blanket-&amp;-Throws/">Blanket &amp; Throws</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300107/Throw-Beds/">Throw
                                        Beds</a></h2></div>
                                    <div className="cel-top-menu"><h1><a>Bedding Basics</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/all/3002/All-Bedding-Basics/">All
                                        Bedding Basics</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300201/Pillow-Inserts/">Pillow
                                        Inserts</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300202/Duvet-Inserts/">Duvet
                                        Inserts</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300203/Mattress-Pads/">Mattress
                                        Pads</a></h2><h2/><h2/><h2/><h2
                                    /><h2/></div>
                                    <div className="cel-top-menu"><h1><a>Bathroom</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/all/3003/All-Bath/">All Bath</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300301/Bath-Towels/">Bath
                                        Towels</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300302/Bath-Rugs/">Bath
                                        Rugs</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300303/Bath-Robes/">Bath
                                        Robes</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300304/Shower-Curtains/">Shower
                                        Curtains</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/300305/Bathroom-Accessories/">Bathroom
                                        Accessories</a></h2></div>
                                </div>
                            </div>
                        </li>
                        <li><a>TABLETOP &amp; KITCHEN</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu"><h1><a>Table Linens</a></h1><h2>
                                        <a href="http://www.doopsalta.com/en/product/all/4001/All-Table-Linens/">All
                                            Table Linens</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400101/Tablecloths/">Tablecloths</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400102/Runners/">Runners</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400103/Placemats/">Placemats</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400104/Napkins/">Napkins</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400105/Napkin-Holders/">Napkin
                                        Holders</a></h2><h1><a>Dinnerware</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400201/Dinnerware-Sets/">Dinnerware
                                        Sets</a></h2></div>
                                    <div className="cel-top-menu"><h1><a>Kitchen Linens</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/all/4003/All-Kitchen-Linens/">All
                                        Kitchen Linens</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400301/Kitchen-Towels/">Kitchen
                                        Towels</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400302/Aprons/">Aprons</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400303/Oven-Mitts/">Oven
                                        Mitts</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400304/Potholders/">Potholders</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400305/Cooking-Pot-Pads/">Cooking
                                        Pot Pads</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/400306/Bread-Baskets/">Bread
                                        Baskets</a></h2></div>
                                </div>
                            </div>
                        </li>
                        <li><a>Decor</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu"><h1><a>Home Accessories</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/500101/Candles/">Candles</a>
                                    </h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500102/Candle-Holders/">Candle
                                        Holders</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500103/Wax-Melts/">Wax
                                        Melts</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500104/Aromatherapy-Diffusers/">Aromatherapy
                                        Diffusers</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500105/Baskets/">Baskets</a>
                                    </h2><h2/><h2/><h2/></div>
                                    <div className="cel-top-menu"><h1><a>Pillows &amp; Throws</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/500201/Decorative-Pillows/">Decorative
                                        Pillows</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500202/Pillow-Inserts/">Pillow
                                        Inserts</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500203/Throws/">Throws</a>
                                    </h2><h2/><h1><a>Picnic Essentials</a></h1><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500301/Picnic-Mats/">Picnic
                                        Mats</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500302/Picnic-Blankets/">Picnic
                                        Blankets</a></h2><h2/></div>
                                    <div className="cel-top-menu"><h1><a>Home Organization</a></h1><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/product/cat/500401/Remote-Control-Holder/">Remote
                                        Control Holder</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500402/Jewelry-Holder/">Jewelry
                                        Holder</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500403/Shoe-Storage/">Shoe
                                        Storage</a></h2><h2><a
                                        href="http://www.doopsalta.com/en/product/cat/500404/Sweater-Storage/">Sweater
                                        Storage</a></h2></div>
                                </div>
                            </div>
                        </li>
                        <li><a>Fabric</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu"><h1><a>Fabric By The Meter</a></h1></div>
                                </div>
                            </div>
                        </li>
                        <li><a>Sale</a>
                            <div className="mega" style={{display: 'none'}}>
                                <div className="sub_menu">
                                    <div className="cel-top-menu">
                                        <h1><a>SALE</a>
                                        </h1>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat//All-Sale/">All Sale</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat//Bedding/">Bedding</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat//Bath/">Bath</a>
                                        </h2>
                                        <h2
                                        ><a
                                            href="http://www.doopsalta.com/en/product/cat//Window-Treatments/">Window
                                            Treatments</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat//Tabletop-&amp;-Kitchen/">Tabletop &amp; Kitchen</a>
                                        </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat//Decor/">Decor</a></h2><h2
                                    ><a
                                        href="http://www.doopsalta.com/en/blind/custom/DE3B6E1/">Furniture</a>
                                    </h2>
                                        <h2><a
                                            href="http://www.doopsalta.com/en/product/cat//Fabrics/">Fabrics</a>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="bghover">
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default Header;
