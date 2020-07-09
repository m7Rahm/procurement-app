import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    IoMdMenu,
    IoMdDocument,
    IoIosArchive,
    IoMdCart,
    IoMdCheckmarkCircleOutline
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
    const [activeLink, setActiveLink] = useState(0)
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
                        links.map((link, index) => {
                            const active = index === activeLink ? true : false
                            const Icon = icon(link.icon, active)
                            return <div key={index} style={setStyle(active)} onClick={() => setActiveLink(index)}>
                                <Icon size="24" />
                                <Link style={{color: active ? '#222222' : '', fontWeight: active ? 600 : ''}} to={link.link}>{link.text}</Link>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
const links = [
    {
        text: 'Sifarişlərim',
        link: '/',
        icon: IoMdCart
    },
    {
        text: 'Vizalarım',
        link: '/visas',
        icon: IoMdCheckmarkCircleOutline
    },
    {
        text: 'Drafts',
        link: '/drafts',
        icon: IoMdDocument
    },
    {
        text: 'Arxiv',
        link: '/archived',
        icon: IoIosArchive
    },
]
export default React.forwardRef(LeftSidePane)