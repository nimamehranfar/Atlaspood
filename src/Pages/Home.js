import React, {useEffect, useState} from "react";
import main_page_img from '../Images/public/Homepage_Image.jpeg';
import main_page_img1 from '../Images/public/main_page_img1.jpg';
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {useParams} from "react-router-dom";



function Home() {
    const  {lang} = useParams();
    const [index, setIndex] = useState(0);
    const { t } = useTranslation();
    
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    
    return (<div className="main_page_container">
        <Header/>
        <div className="main_page_mid">
            <div className="col-lg-12">
                <div className="main_page_slide_show">
                    <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" pause="false">
                        <Carousel.Item interval={4500}>
                            <img src={main_page_img} className="img-fluid" alt=""/>
                            <Carousel.Caption>
                                <h3>CUSTOM WINDOW COVERING</h3>
                                <p>MADE EASY.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={4500}>
                            <img src={main_page_img1} className="img-fluid" alt=""/>
                            
                            <Carousel.Caption>
                                {/*<h3>Custom window covering</h3>*/}
                                {/*<p>make easy.</p>*/}
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
        </div>
        <Footer/>
    </div>);
}

export default Home;
