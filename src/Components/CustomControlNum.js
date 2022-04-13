import React from "react";
import {useLocation} from "react-router-dom";
import NumberToPersianWord from "number_to_persian_word";


function CustomControlNum({props, state, methods,postfix, postfixFa}) {
    const location = useLocation();
    return (
        <div className="select_control_container" onClick={() => methods.dropDown('toggle')}>
            <span>{state.values.length > 0 ? (location.pathname.split('').slice(1, 3).join('')==="fa"? NumberToPersianWord.convertEnToPe(`${state.values[0]["value"]}`)+postfixFa:state.values[0]["value"]+postfix) : props.placeholder}</span>
            <i className="select_control_handle_close"/>
        </div>
    );
}

export default CustomControlNum;