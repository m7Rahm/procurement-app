import React from 'react'
import {
    IoMdMenu
} from 'react-icons/io'
import { Link } from 'react-router-dom'
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
            <Link to="/" style={{textDecoration: 'none', display: 'block', padding: '10px'}}>Sifarişlərim</Link>
            <Link to="/visas" style={{textDecoration: 'none', display: 'block', padding: '10px'}}>Vizalarım</Link>
            </div>
        </div>
    )
}
export default React.forwardRef(LeftSidePane)