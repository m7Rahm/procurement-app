import React, { useRef, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom'
import {
    IoMdMenu
} from 'react-icons/io'
import Visas from '../pages/Visas'
import MyOrders from '../pages/Orders/MyOrders'
import logo from '../logo.svg'
import LeftSidePane from './LeftSidePane';
import Drafts from '../pages/Drafts';
import Archived from '../pages/Archived';
import Inbox from '../pages/Inbox'
import PriceOffers from '../pages/PriceOffers'
import WareHouse from '../pages/WareHouse'
import AdminPage from '../pages/AdminPage'
import Users from '../pages/Users'
import SysParams from '../pages/Admin/SysParams'
import Budget from '../pages/Budget'
import { availableOperations } from '../data/data'
import {
    IoMdDocument,
    IoIosArchive,
    IoMdCart,
    IoMdCheckmarkCircleOutline,
    IoMdPricetags,
    IoMdSettings
} from 'react-icons/io'
import {
    FaEnvelopeOpenText,
    FaWarehouse,
    FaUsers
} from 'react-icons/fa'
import {
    ImTree
} from 'react-icons/im'
import {
    MdDashboard
} from 'react-icons/md'

const availableLinks = [
    {
        text: 'Vizalarım',
        link: '/visas',
        icon: IoMdCheckmarkCircleOutline,
        component: Visas
    },
    {
        text: 'Büccə',
        link: '/budget',
        icon: IoMdCheckmarkCircleOutline,
        component: Budget
    },
    {
        text: 'Drafts',
        link: '/drafts',
        icon: IoMdDocument,
        component: Drafts
    },
    {
        text: 'Arxiv',
        link: '/archived',
        icon: IoIosArchive,
        component: Archived
    },
    {
        text: 'Gələnlər',
        link: '/inbox',
        icon: FaEnvelopeOpenText,
        component: Inbox
    },
    {
        text: 'Qiymət təklifləri',
        link: '/priceoffs',
        icon: IoMdPricetags,
        component: PriceOffers
    },
    {
        text: 'Anbar',
        link: '/warehouse',
        icon: MdDashboard,
        component: WareHouse
    },
    {
        text: 'Users',
        link: '/users',
        icon: FaUsers,
        component: Users
    },
    {
        text: 'System Params',
        link: '/sys',
        icon: IoMdSettings,
        component: SysParams
    },
    {
        text: 'Structure',
        link: '/structure',
        icon: ImTree,
        component: MyOrders
    },
    {
        text: 'Dashboard',
        link: '/dashboard',
        icon: FaWarehouse,
        component: AdminPage
    },
    {
        text: 'Sifarişlərim',
        link: '/',
        icon: IoMdCart,
        component: MyOrders
    },
];

const App = (props) => {
    const leftPaneRef = useRef(null);
    const backgroundRef = useRef(null);
    // const [backgroundVisibility, setBackgroundVisibility] = useState(false);
    const [wSockConnected, setWSockConnected] = useState(false);
    const webSocketRef = useRef(null);
    const [userData, setUserData] = useState({links: [], previliges: []});
    // const userData = 
    const token = props.token
    useEffect(() => {
        // console.log(token);
        if (token) {
            const webSocket = new WebSocket('ws://172.16.3.101:12345');
            webSocket.onopen = () => {
                fetch('http://172.16.3.101:54321/api/get-user-data', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(resp => {
                        if(resp.status === 200)
                            resp.json()
                        else
                            throw new Error('Internal Server Error');
                    })
                    .then(respJ => {
                        const id = respJ.userData.response.id;
                        const availableMenus = respJ.userData.response.availableMenus.split(',');
                        const previliges = respJ.userData.response.previliges.split(',');
                        const userMenus = availableLinks.filter(menu => availableMenus.find(availableMenu => availableMenu === menu.text));
                        const userPreviliges = availableOperations.filter(operation => previliges.find(previlige => previlige === operation));
                        setUserData({links: userMenus, previliges: userPreviliges})
                        const data = {
                            action: "recognition",
                            person: id // todo: get from session
                        }
                        console.log('connected');
                        webSocket.send(JSON.stringify(data));
                        // setWebSocketRef(webSocket);
                        webSocketRef.current = webSocket
                        setWSockConnected(true);
                    })
                    .catch(ex => console.log(ex))
            }
            return () => {
                webSocket.close();
                setWSockConnected(false);
                console.log('connection closed');
            }
        }
    }, [token])
    const handleNavClick = () => {
        leftPaneRef.current.classList.toggle('left-side-pane-open');
        const backgroundDisplay = backgroundRef.current.style.display === 'none' ? 'block' : 'none'
        backgroundRef.current.style.display = backgroundDisplay
    }
    useEffect(() => {
        const closeNav = (e) => {
            if (e.keyCode === 27 && leftPaneRef.current.classList.contains('left-side-pane-open')) {
                leftPaneRef.current.classList.toggle('left-side-pane-open');
                const backgroundDisplay = backgroundRef.current.style.display === 'none' ? 'block' : 'none'
                backgroundRef.current.style.display = backgroundDisplay
            }
        }
        document.addEventListener('keyup', closeNav, false);
        return () => document.removeEventListener('keyup', closeNav, false)
    }, []);
    const handleLogOut = () => {
        props.setToken('')
        localStorage.removeItem('token');
    }
    return (
        wSockConnected &&
        <>
            <>
                <nav>
                    <ul>
                        <li>
                            <div>
                                <div className="left-side-toggle">
                                    <IoMdMenu size="24" cursor="pointer" color="#606060" onClick={handleNavClick} />
                                </div>
                                <div>
                                    <img style={{ height: '32px', cursor: 'pointer' }} onClick={handleLogOut} src={logo} alt='user pic'></img>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
                <div
                    onClick={handleNavClick}
                    ref={backgroundRef}
                    style={{
                        position: 'fixed',
                        height: '100%',
                        width: '100%',
                        top: 0,
                        left: 0,
                        display: 'none',
                        background: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 2
                    }}>
                </div>
            </>
            <LeftSidePane links={userData.links} ref={leftPaneRef} handleNavClick={handleNavClick} />
            <Switch>
                {
                    userData.links.map((link, index) => {
                        return (
                            <Route key={index} path={link.link}>
                                <link.component token={token} userData={userData} webSocketRef={webSocketRef} />
                            </Route>
                        )
                    })
                }
            </Switch>
        </>
    )
}
export default App