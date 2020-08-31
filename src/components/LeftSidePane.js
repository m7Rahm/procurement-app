import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    IoMdMenu,
    IoMdDocument,
    IoIosArchive,
    IoMdCart,
    IoMdCheckmarkCircleOutline,
    IoMdPricetags
} from 'react-icons/io'
import {
    FaEnvelopeOpenText,
    FaTasks
} from 'react-icons/fa'
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
                        links.map((link, index) => {
                            const active = index === activeLink ? true : false
                            const Icon = icon(link.icon, active)
                            return <div key={index} style={setStyle(active)} >
                                <Link
                                    onClick={() => setActiveLink(index)}
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
    {
        text: 'Gələnlər',
        link: '/inbox',
        icon: FaEnvelopeOpenText
    },
    {
        text: 'Qiymət təklifləri',
        link: '/priceoffs',
        icon: IoMdPricetags
    },
    {
        text: 'Tapşırıqlar',
        link: '/tasks',
        icon: FaTasks
    },
]
export default React.memo(React.forwardRef(LeftSidePane))