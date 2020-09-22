import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    IoMdMenu,
} from 'react-icons/io'
const icon = (Icon, active) => ({ ...props }) =>
    <Icon color={active ? "red" : '#808080'} {...props} />

const setStyle = (active) => {
    const style = active
        ? {
            background: 'rgba(0, 0, 0, 0.1)',
            color: 'black'
        }
        : {}
    return style
}
const LeftSidePane = (props, ref) => {
    const [activeLink, setActiveLink] = useState(0);
    const handleNavClick = props.handleNavClick;
    return (
        <div ref={ref} className="left-side-pane">
            <div>
                <div>
                    <IoMdMenu size="24" cursor="pointer" color="white" onClick={handleNavClick} />
                </div>
            </div>
            <div>
                <div>
                    {
                        props.links.map((link, index) => {
                            const active = index === activeLink ? true : false
                            const Icon = icon(link.icon, active)
                            return <div key={index} style={setStyle(active)} >
                                <Link
                                    onClick={() => {
                                        setActiveLink(index);
                                        handleNavClick();
                                    }}
                                    style={{color: active ? '#222222' : '', fontWeight: active ? 600 : '', display: 'flex', width: '100%', alignItems: 'flex-end'}}
                                    to={link.link}>
                                    <Icon size="24" style={{marginRight: '5px'}} />
                                    {link.text}
                                </Link>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default React.memo(React.forwardRef(LeftSidePane), () => true)