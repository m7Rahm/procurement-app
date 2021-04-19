import React, { useEffect, useState } from 'react'
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
    useEffect(() => {
        const escPress = (e) => {
            if (e.keyCode === 27 && ref.current.classList.contains("left-side-pane-open")) {
                ref.current.classList.remove("left-side-pane-open");
                props.backgroundRef.current.style.display = "none"
            }
        }
        document.addEventListener("keyup", escPress, false)
        return () => {
            document.removeEventListener("keyup", escPress, false)
        }
    }, [props.backgroundRef, ref])
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
                                    style={{ color: active ? '#222222' : '', fontWeight: active ? 600 : '', display: 'flex', width: '100%', alignItems: 'flex-end' }}
                                    to={`${props.url}${link.link}`}>
                                    <Icon size="24" style={{ marginRight: '5px' }} />
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

export default React.forwardRef(LeftSidePane)