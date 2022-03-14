import React from "react";

function CustomControl({props, state, methods}) {
    return (
        <div className="select_control_container" onClick={() => methods.dropDown('toggle')}>
            <span>{state.values.length > 0 ? state.values[0]["label"] : props.placeholder}</span>
            <i className="select_control_handle_close"/>
        </div>
    );
}

export default CustomControl;