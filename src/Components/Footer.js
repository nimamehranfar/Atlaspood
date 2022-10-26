import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

function Footer() {
    const { t } = useTranslation();
    const location = useLocation();
    const [pageLanguage, setPageLanguage] = React.useState(location.pathname.split('').slice(1, 3).join(''));
    
    useEffect(() => {
        const tempLang = location.pathname.split('');
        setPageLanguage(tempLang.slice(1).join(''));
        
    }, [location.pathname]);
    
    return (
        <div className="page_bottom">
            <div className="col-lg-12">
                <div className="page_footer">
                    <div className="page_footer_left">
                        <div className="page_footer_left_column">
                            <div className="footer_box">
                                <h1>{t("GET IN TOUCH")}</h1>
                                <ul>
                                    <li><p>{t("work_time_1")}<br/>{t("work_time_2")}</p></li>
                                    <li>
                                        <img src={require('../Images/public/phone.svg').default} className="img-fluid svg"
                                             alt=""/>
                                        <a href="tel:02188908817">(021) 88908817</a></li>
                                    <li>
                                        <img src={require('../Images/public/mail.svg').default} className="img-fluid svg"
                                             alt=""/>
                                        <a href="mailto:assistant@atlaspood.com">assistant@atlaspood.com</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="page_footer_left_column ">
                            <div className="footer_box">
                                <h1>{t("CUSTOMER CARE")}</h1>
                                <ul>
                                    <li><a href="">{t("Measure_Install")}</a></li>
                                    <li><a href="">{t("Track Your Order")}</a></li>
                                    <li><a href="">{t("Return Policy")}</a></li>
                                    <li><a href="">{t("Shipping Information")}</a></li>
                                    <li><a href="">{t("faq")}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="page_footer_left_column ">
                            <div className="footer_box">
                                <h1>{t("OUR COMPANY")} </h1>
                                <ul>
                                    <li><a href="">{t("About Us")}</a></li>
                                    <li><a href="">{t("Store Locations")}</a></li>
                                    <li><a href="">{t("Careers")}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="page_footer_left_column ">
                            <div className="footer_box">
                                <h1>{t("B2B PROGRAMS")}</h1>
                                <ul>
                                    <li><a href="">{t("Wholesale")}</a></li>
                                    <li><a href="">{t("Hospitality")}</a></li>
                                    <li><a href="">{t("Trade")}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="page_footer_right">
                        <div className="footer_box-newsletter">
                            <form method="post" action="#">
                                <label>{t("text_above_email")}</label>
                                <div className="display_flex">
                                    <input type="text" maxLength="40" name="email" id="email"
                                           placeholder={t("Email_placeholder")} className={`input-search ${pageLanguage === 'fa' ? "font_farsi" : null}`} />
                                    <input type="submit" name="submit" value={t("submit")} id="join"/>
                                </div>
                                <div className="footer-erorr-gorup">
                                    <span className="error-footer">Enter the correct email</span>
                                    <span className="success-footer">Your email has been logged in</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="under_footer">
                    <div className="page_social_media">
                        <span className="icon-paper-plane"><i className="fa fa-paper-plane"/></span>
                        <span className="icon-facebook"><i className="fa fa-facebook"/></span>
                        <span className="icon-instagram"><i className="fa fa-instagram"/></span>
                    </div>
                    <div className="copyright">
                        {t("2022 © All Rights Reserved for Atlas Viewer.")}<a
                        href="https://www.doopsalta.com/en/page/EF8C077/rules/">{t("Site Rules")}</a>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Footer;
