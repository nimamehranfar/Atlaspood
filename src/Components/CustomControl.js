import React from "react";

function CustomControl({props, state, methods}) {
    return (
        <div className="select_control_container" onClick={() => methods.dropDown('toggle')}>
            <span>{state.values.length > 0 ? state.values[0]["label"] : props.placeholder}</span>
            {/*<i className="select_control_handle_close"/>*/}
            {/*<img className="select_control_handle_close img-fluid" src={require('../Images/public/arrow_down.svg').default} alt=""/>*/}
        </div>
    );
}

export default CustomControl;