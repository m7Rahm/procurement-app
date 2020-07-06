import React from 'react'
import {
    IoMdMenu
} from 'react-icons/io'
const LeftSidePane = (props, ref) => {
    const handleNavClick = props.handleNavClick;
    return (
        <div ref={ref} className="left-side-pane">
            <div>
                <div>
                    <IoMdMenu size="24" cursor="pointer" color="white" onClick={handleNavClick} />
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}
export default React.forwardRef(LeftSidePane)