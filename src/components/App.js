import React, { useRef, useState, useEffect } from 'react';
import Visas from '../pages/Visas'
import MyOrders from '../pages/MyOrders'
import logo from '../logo.svg'
import { Route, Switch } from 'react-router-dom'
import {
    IoMdMenu
} from 'react-icons/io'
import LeftSidePane from './LeftSidePane';
import Drafts from '../pages/Drafts';
import Archived from '../pages/Archived';
import Inbox from '../pages/Inbox'
import PriceOffers from '../pages/PriceOffers'
import WareHouse from '../pages/WareHouse'
import AdminPage from '../pages/AdminPage'
import Users from '../components/admin/Users'
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
const userLinks = [
    {
        text: 'Sifarişlərim',
        link: '/',
        icon: IoMdCart,
        component: MyOrders
    },
    {
        text: 'Vizalarım',
        link: '/visas',
        icon: IoMdCheckmarkCircleOutline,
        component: Visas
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
];

const adminLinks = [
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
        component: MyOrders
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
];
const App = () => {
    const leftPaneRef = useRef(null);
    const [backgroundVisibility, setBackgroundVisibility] = useState(false);
    const [wSockConnected, setWSockConnected] = useState(false);
    const webSocketRef = useRef(null);
    const [links, setLinks] = useState([]);
    // const userData = 
    // console.log(localStorage.getItem(''))
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const webSocket = new WebSocket('ws://172.16.3.101:12345');
            webSocket.onopen = () => {
                fetch('http://172.16.3.101:54321/api/get-user-data',{
                    headers: {
                      'Authorization': 'Bearer ' + token
                    }
                  })
                .then(resp => resp.json())
                .then(respJ => {
                    console.log(respJ)
                    const id = respJ.userData.response.id;
                    const status = respJ.userData.response.status;
                    if(status === 'admin')
                        setLinks(adminLinks)
                    else   
                        setLinks(userLinks)
                    const data = {
                        action: "recognition",
                        person: id // todo: get from session
                    }
                    console.log(id)
                    console.log('connected');
                    webSocket.send(JSON.stringify(data));
                    // setWebSocketRef(webSocket);
                    webSocketRef.current = webSocket
                    setWSockConnected(true);
                })
                .catch(ex => console.log(ex))
                // console.log(document.cookie.split(';'));
                // const id = document.cookie.split(';')
                //   .find(cookie => cookie.includes('id='))
                // .trim()
                // .substr(3);
            }
            return () => {
                webSocket.close();
                setWSockConnected(false);
                console.log('connection closed');
                // setWebSocketRef(null);
            }
        }
    }, [])
    const handleNavClick = () => {
        leftPaneRef.current.classList.toggle('left-side-pane-open');
        setBackgroundVisibility(prev => !prev)
    }
    useEffect(() => {
        const closeNav = (e) => {
            if (e.keyCode === 27 && leftPaneRef.current.classList.contains('left-side-pane-open')) {
                leftPaneRef.current.classList.toggle('left-side-pane-open');
                setBackgroundVisibility(prev => !prev)
            }
        }
        document.addEventListener('keyup', closeNav, false);
        return () => document.removeEventListener('keyup', closeNav, false)
    }, []);
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
                                    <img style={{ height: '32px' }} src={logo} alt='user pic'></img>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
                {
                    backgroundVisibility &&
                    <div
                        onClick={handleNavClick}
                        style={{
                            position: 'fixed',
                            height: '100%',
                            width: '100%',
                            top: 0,
                            left: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 2
                        }}>
                    </div>
                }
            </>
            <LeftSidePane links={links} ref={leftPaneRef} handleNavClick={handleNavClick} />
            <Switch>
                {
                    links.map(link =>
                        <Route key={link.link} path={link.link}>
                            <link.component webSocketRef={webSocketRef} />
                        </Route>
                    )
                }
                {/* <Route path="/visas" >
                    <Visas webSocketRef={webSocketRef} />
                </Route>
                <Route path="/archived">
                    <Archived />
                </Route>
                <Route path="/drafts">
                    <Drafts webSocketRef={webSocketRef} />
                </Route>
                <Route path="/inbox">
                    <Inbox webSocketRef={webSocketRef} />
                </Route>
                <Route path="/priceoffs">
                    <PriceOffers webSocketRef={webSocketRef} />
                </Route>
                <Route path="/warehouse">
                    <WareHouse webSocketRef={webSocketRef} />
                </Route>
                <Route path="/admin">
                    <AdminPage/>
                </Route>
                <Route path="/">
                    <MyOrders webSocketRef={webSocketRef} />
                </Route> */}
            </Switch>
        </>
    )
}
export default App