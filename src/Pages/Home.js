import React, {useEffect, useState} from "react";
import main_page_img from '../Images/public/Homepage_Image.jpeg';
import main_page_img1 from '../Images/public/main_page_img1.jpg';
import Carousel from "react-bootstrap/Carousel";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import axios from "axios";
import { NumToFa,convertToPersian} from "../Components/TextTransform";

const baseURLGet = "https://api.atlaspood.ir/WebsiteSetting/GetSlider?apiKey=477f46c6-4a17-4163-83cc-29908d";



function Home() {
    const [index, setIndex] = useState(0);
    const {t} = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    const [slide, setSlide] = React.useState([]);
    const [slideList, setSlideList] = React.useState([]);
    
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    
    function getslide() {
        axios.get(baseURLGet).then((response) => {
            let arr = response.data;
            setSlide(arr.slide);
        }).catch(err => {
            console.log(err);
        });
        
    }
    
    function renderslide() {
        const slideLists = [];
        for (let i = 0; i < slide.length; i++) {
            let url = slide[i].url;
            let text1EN = slide[i].text1EN;
            let text2EN = slide[i].text2EN;
            let text1 = slide[i].text1;
            let text2 = slide[i].text2;
            
            slideLists.push(
                <Carousel.Item interval={4500} key={"slide" + i} slide_id={i} className={`unselectable ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                    <img src={(url === undefined || url === null || url === "")? `${process.env.PUBLIC_URL}/no_image.svg` : `https://api.atlaspood.ir${url}`} className={`img-fluid ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`} alt=""/>
                    <Carousel.Caption className={`unselectable ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>
                        <h3 className={`unselectable ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{pageLanguage === 'en' ? text1EN : convertToPersian(text1)}</h3>
                        <p className={`unselectable ${pageLanguage === 'fa' ? "font_farsi" : "font_en"}`}>{pageLanguage === 'en' ? text2EN : convertToPersian(text2)}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            );
        }
        setSlideList(slideLists);
        // console.log(slideLists)
    }
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1, 3).join(''));
        // setIndex(1);
        setSlideList([]);
    }, [location.pathname]);
    
    useEffect(() => {
        if (pageLanguage !== '') {
            setTimeout(() => {
                getslide();
            }, 200);
        }
    }, [pageLanguage]);
    
    useEffect(() => {
        if (slide.length) {
            renderslide();
        }
    }, [slide]);
    
    // useEffect(() => {
    //     getslide();
    // }, []);
    
    return (
        <div className="main_page_mid">
            <div className="col-lg-12">
                <div className="main_page_slide_show">
                    <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" pause="false">
                        {slideList}
                        {/*<Carousel.Item interval={4500}>*/}
                        {/*    <img src={main_page_img} className="img-fluid" alt=""/>*/}
                        {/*    <Carousel.Caption>*/}
                        {/*        <h3 className="unselectable">{t("CUSTOM WINDOW COVERING")}</h3>*/}
                        {/*        <p className="unselectable">{t("MADE EASY.")}</p>*/}
                        {/*    </Carousel.Caption>*/}
                        {/*</Carousel.Item>*/}
                        {/*<Carousel.Item interval={4500}>*/}
                        {/*    <img src={main_page_img1} className="img-fluid" alt=""/>*/}
                        {/*    */}
                        {/*    <Carousel.Caption>*/}
                        {/*        /!*<h3>Custom window covering</h3>*!/*/}
                        {/*        /!*<p>make easy.</p>*!/*/}
                        {/*    </Carousel.Caption>*/}
                        {/*</Carousel.Item>*/}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

export default Home;
