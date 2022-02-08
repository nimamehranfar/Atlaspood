import {useParams} from "react-router-dom";
import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Product() {
    const {params} = useParams();
    
    return(
        <div className="Product_page_container">
            {params}
        </div>
    
    );
}

export default Product;