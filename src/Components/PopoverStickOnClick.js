import PropTypes from 'prop-types';
import { Overlay, Popover } from 'react-bootstrap';
import React, {useEffect, useRef, useState} from "react";

function PopoverStickOnClick({ delay, onMouseEnter, children, component, placement, classNames }) {
    const [showPopover, setShowPopover] = useState(false);
    const [showPopover2, setShowPopover2] = useState(0);
    const childNode = useRef(null);
    const node = useRef(null);
    let setTimeoutConst = null;
    
    useEffect(() => {
        return () => {
            if (setTimeoutConst) {
                clearTimeout(setTimeoutConst);
            }
        };
    });
    
    const handleMouseEnter = () => {
		if(showPopover2===1){
            setShowPopover(false);
			setShowPopover2(0);
		}
		else{
			setShowPopover(true);
			setShowPopover2(1);
		}
    };
    
    const handleMouseLeave = () => {
        clearTimeout(setTimeoutConst);
        setShowPopover(false);
		setShowPopover2(0);
    };
	
	const handleClickOutside = (event) => {
        if (node.current && !node.current.contains(event.target) && childNode.current && !childNode.current.contains(event.target)) {
            handleMouseLeave();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
    
    const displayChild = React.Children.map(children, child =>
        React.cloneElement(child, {
            onClick: handleMouseEnter,
            ref: node => {
                childNode.current = node;
                const { ref } = child;
                if (typeof ref === 'function') {
                    ref(node);
                }
            }
        })
    )[0];
    
    const displayComponent =
        React.cloneElement(component, {
            ref: node
        });
    
    return (
        <>
            {displayChild}
            <Overlay
                show={showPopover}
                placement={placement}
                target={childNode}
                shouldUpdatePosition
            >
                <Popover
                    id="popover"
                    className={classNames}
                >
                    {displayComponent}
                </Popover>
            </Overlay>
        </>
    );
}

PopoverStickOnClick.propTypes = {
    children: PropTypes.element.isRequired,
    delay: PropTypes.number,
    onMouseEnter: PropTypes.func,
    component: PropTypes.node.isRequired,
    placement: PropTypes.string.isRequired,
    // classNames: PropTypes.string.isRequired,
};

PopoverStickOnClick.defaultProps = {
    delay: 0
};

export default PopoverStickOnClick;