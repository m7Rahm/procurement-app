import React, { useEffect, useRef } from 'react'
import { IoMdMenu } from 'react-icons/io';
import { Link } from 'react-router-dom'
import logo from '../../logo.svg';
const Navigation = (props) => {
    const moduleNavigationRef = useRef(null);
    useEffect(() => {
        const eventHandler = (data) => { console.log(data) }
        window.addEventListener("websock", eventHandler, false);
        props.webSocketRef.current.onmessage = (data) => {
            const event = new CustomEvent("websock", { detail: { data }});
            window.dispatchEvent(event);
        }
        return () => window.removeEventListener("websock", eventHandler)
    }, [props.webSocketRef])
    const handleLogOut = () => {
        props.tokenContext[1]({ token: '', userData: {} })
        localStorage.removeItem('token');
    }
    const handleIconClick = () => {
        moduleNavigationRef.current.style.display = moduleNavigationRef.current.style.display === 'block' ? 'none' : 'block'
    }
    return (
        <nav>
            <ul>
                <li>
                    <div>
                        <div className="left-side-toggle">
                            <IoMdMenu size="24" cursor="pointer" color="#606060" onClick={props.handleNavClick} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img style={{ height: '32px', cursor: 'pointer', width: '45px' }} onClick={handleIconClick} src={logo} alt='user pic'>
                            </img>
                            <ul ref={moduleNavigationRef} className="profile-icon">
                                {
                                    props.routes.map(module =>
                                        <li key={module.link}>
                                            <Link to={module.link}>
                                                <div >
                                                    {module.text}
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                }
                                <li onClick={handleLogOut}>
                                    <div style={{ minWidth: '60px' }}>Log out</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation