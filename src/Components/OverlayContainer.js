import PropTypes from 'prop-types';
import { Overlay, Popover } from 'react-bootstrap';
import React, {useEffect, useRef, useState} from "react";

function OverlayContainer({ delay, onMouseEnter, children, component, placement, classNames }) {
    const [showPopover, setShowPopover] = useState(false);
    const childNode = useRef(null);
    let setTimeoutConst = null;
    
    useEffect(() => {
        return () => {
            if (setTimeoutConst) {
                clearTimeout(setTimeoutConst);
            }
        };
    });
    
    const handleMouseEnter = () => {
        setTimeoutConst = setTimeout(() => {
            setShowPopover(true);
            onMouseEnter();
        }, delay);
    };
    
    const handleMouseLeave = () => {
        clearTimeout(setTimeoutConst);
        setShowPopover(false);
    };
    
    const displayChild = React.Children.map(children, child =>
        React.cloneElement(child, {
            onMouseEnter: handleMouseEnter,
            onMouseOver: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            ref: node => {
                childNode.current = node;
                const { ref } = child;
                if (typeof ref === 'function') {
                    ref(node);
                }
            }
        })
    )[0];
    
    return (
        <div className="OverlayContainer" >
            {displayChild}
            <div className={(showPopover?"CustomOverlay":"noDisplay") + (placement==="right"?" OverlayContainerRight":(placement==="left"?" OverlayContainerLeft":(placement==="middle"?" OverlayContainerMiddle":"")))}
                 onMouseEnter={() => {
                     setShowPopover(true);
                 }}
                 onMouseLeave={handleMouseLeave}>
                <div className={classNames}>
                    {component}
                </div>
            </div>
        </div>
    );
}

OverlayContainer.propTypes = {
    children: PropTypes.element.isRequired,
    delay: PropTypes.number,
    onMouseEnter: PropTypes.func,
    component: PropTypes.node.isRequired,
    placement: PropTypes.string.isRequired,
    // classNames: PropTypes.string.isRequired,
};

OverlayContainer.defaultProps = {
    delay: 0,
    onMouseEnter: () => {}
};

export default OverlayContainer;