import React from "react";

function CustomControlMulti({props, state, methods}) {
    let controlPlaceHolder=props.placeholder;
    if(state.values.length > 0){
        controlPlaceHolder= state.values.map(item => item.label).join(', ');
    }
    return (
        <div className="select_control_container" onClick={() => methods.dropDown('toggle')}>
            <span>{controlPlaceHolder}</span>
            <i className="select_control_handle_close"/>
        </div>
    );
}

export default CustomControlMulti;