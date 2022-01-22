import React from "react";


function Footer() {
    return (
        <div className="page_bottom">
            <div className="col-lg-12">
                <div className="page_footer">
                    <div className="page_footer_left">
                        <div className="page_footer_left_column">
                            <div className="footer_box">
                                <h1>GET IN TOUCH</h1>
                                <ul>
                                    <li><p>Sat - Thu: 9:30 am to 9:00 pm <br/> Fri: 10:30 am to 9:00pm</p></li>
                                    <li>
                                        <img src={require('../Images/public/phone.svg')} className="img-fluid svg"
                                             alt=""/>
                                        <a href="tel:02188908817">(021) 88908817</a></li>
                                    <li>
                                        <img src={require('../Images/public/mail.svg')} className="img-fluid svg"
                                             alt=""/>
                                        <a href="mailto:assistant@atlaspood.com">assistant@atlaspood.com</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="page_footer_left_column ">
                            <div className="footer_box">
                                <h1>CUSTOMER CARE</h1>
                                <ul>
                                    <li><a href="">Measure &amp; Install</a></li>
                                    <li><a href="">Track Your Order</a></li>
                                    <li><a href="">Return Policy</a></li>
                                    <li><a href="">Shipping Information</a></li>
                                    <li><a href="">Frequently Asked Questions</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="page_footer_left_column ">
                            <div className="footer_box">
                                <h1>OUR COMPANY </h1>
                                <ul>
                                    <li><a href="">About Us</a></li>
                                    <li><a href="">Store Locations</a></li>
                                    <li><a href="">Careers</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="page_footer_left_column ">
                            <div className="footer_box">
                                <h1>B2B PROGRAMS</h1>
                                <ul>
                                    <li><a href="">Wholesale </a></li>
                                    <li><a href="">Hospitality</a></li>
                                    <li><a href="">Trade</a></li>
                                    <li><a href="http://www.doopsalta.com/en/meter-form/stepone/">Request
                                        Meter</a></li>
                                    <li><a href="http://www.doopsalta.com/en/login-meter/">Meter Panel</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="page_footer_right">
                        <div className="footer_box-newsletter">
                            <form method="post" action="#">
                                <label>Join our list and get 10% off your first purchase!</label>
                                <div className="display_flex">
                                    <input type="text" maxLength="40" name="email" id="email"
                                           placeholder="Email address"/>
                                    <input type="submit" name="submit" value="SUBMIT" id="join"/>
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
                        2021 © All Rights Reserved for Atlas Viewer.<a
                        href="http://www.doopsalta.com/en/page/EF8C077/rules/"> Site Rules</a>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Footer;
