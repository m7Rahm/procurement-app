import React, { useEffect, useRef, useState } from 'react'
import { IoMdMenu } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md'
import logo from '../../logo.svg';
const getNotifText = (notif) => {
    if (notif.category_id === 1)
        return <> yeni sifariş</>
    else if (notif.category_id === 2)
        return (
            <>
                № <span style={{ color: 'tomato' }}>{notif.doc_number}</span> sənəd {
                    notif.action === 1
                        ? 'təsdiq edildi'
                        : notif.action === 2
                            ? "redaktəyə qaytarıldı"
                            : notif.action === 3
                                ? "redaktə edildi"
                                : "etiraz edildi"
                }
            </>
        )
    else if (notif.category_id === 3)
        return " yeni müqavilə razılaşması göndərdi"
    else if (notif.category_id === 4)
        return " yeni ödəniş razılaşması göndərdi"
}
const Navigation = (props) => {
    const moduleNavigationRef = useRef(null);
    const update = useRef(true);
    const history = useHistory();
    const from = useRef(0);
    const [notifications, setNotifications] = useState({ all: [], visible: [], offsetStart: 0, offsetEnd: 0, count: '', height: 0 })
    const notificationsRef = useRef(null);
    const delimterRef = useRef(null)
    useEffect(() => {
        props.webSocket.onmessage = (data) => {
            const webSockMessage = JSON.parse(data.data);
            const event = new CustomEvent(webSockMessage.messageType, {
                detail: { data: webSockMessage.data }
            });
            if (webSockMessage.messageType !== "recognition") {
                window.dispatchEvent(event);
                if (notificationsRef.current.style.display !== "block")
                    setNotifications(prev => {
                        update.current = true;
                        return ({ ...prev, count: prev.count + 1 })
                    })
                else {
                    fetch(`http://192.168.0.182:54321/api/notifications?from=0&active=1`, {
                        headers: {
                            'Authorization': 'Bearer ' + props.token
                        }
                    })
                        .then(resp => resp.json())
                        .then(respJ => {
                            if (respJ.length !== 0) {
                                setNotifications(prev => {
                                    const newNotifications = prev.all.filter(notification => !respJ.find(newNotifications => newNotifications.id === notification.id));
                                    const all = [...newNotifications, ...respJ]
                                        .sort((a, b) => a.id < b.id)
                                        .map((notification, index) => ({ ...notification, offset: index * 62 }));
                                    const height = all.length * 62;
                                    return { ...prev, all: all, visible: all.slice(prev.offsetStart, prev.offsetEnd), height: height, count: prev.count + 1 }
                                })
                            }

                        })
                        .catch(ex => console.log(ex))
                }
            }
        }
    }, [props.webSocket, props.token]);
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/notifications?from=0', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                setNotifications(prev => ({ ...prev, count: respJ[0].total_count === 0 ? "" : respJ[0].total_count }))
            })
            .catch(ex => console.log(ex))
        const intersectionCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetch(`http://192.168.0.182:54321/api/notifications?from=${from.current * 14}&active=1`, {
                        headers: {
                            'Authorization': 'Bearer ' + props.token
                        }
                    })
                        .then(resp => resp.json())
                        .then(respJ => {
                            update.current = false;
                            if (respJ.length) {
                                const fromIndex = from.current;
                                from.current += 1;
                                setNotifications(prev => {
                                    const fetched = respJ
                                        .filter(fetchedNotif => !prev.all.find(notif => fetchedNotif.id === notif.id))
                                        .map((notif, index) => ({
                                            ...notif,
                                            offset: (fromIndex !== 0 ? prev.height : 0) + index * 62
                                        }));
                                    const newState = [...prev.all, ...fetched];
                                    const visible = newState.filter(notif => notif.offset < 604);
                                    if (prev.count <= newState.filter(notif => !notif.is_read).length) {
                                        observer.unobserve(delimterRef.current)
                                    }
                                    return ({
                                        ...prev,
                                        all: newState,
                                        visible: fromIndex === 0 ? visible : prev.visible,
                                        offsetEnd: fromIndex === 0 ? visible.length : prev.offsetEnd,
                                        height: newState.length * 62
                                    })
                                });
                            }
                        })
                }
            });
        }
        const delimeterRef = delimterRef.current;
        const intersectionObserver = new IntersectionObserver(intersectionCallback, {
            root: notificationsRef.current,
            rootMargin: "100px"
        });
        intersectionObserver.observe(delimterRef.current)
        return () => {
            intersectionObserver.unobserve(delimeterRef)
        }
    }, [props.token]);
    const handleLogOut = () => {
        props.tokenContext[1]({ token: '', userData: {} })
        localStorage.removeItem('token');
        window.location.replace('http://192.168.0.182:62447/?from=procurement&action=logout')
    }
    const handleIconClick = () => {
        moduleNavigationRef.current.style.display = moduleNavigationRef.current.style.display === 'block' ? 'none' : 'block'
    }
    const handleNotificationsClick = () => {
        if (update.current) {
            fetch(`http://192.168.0.182:54321/api/notifications?from=0&active=1`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setNotifications(prev => {
                            const newNotifications = prev.all.filter(notification => !respJ.find(newNotifications => newNotifications.id === notification.id));
                            const all = [...newNotifications, ...respJ]
                                .sort((a, b) => a.id < b.id)
                                .map((notification, index) => ({ ...notification, offset: index * 62 }));
                            const height = all.length * 62;
                            const end = prev.offsetEnd === 0 ? all.length - 1 : prev.offsetEnd
                            return { ...prev, all: all, height: height, visible: all.slice(prev.offsetStart, end), offsetEnd: end }
                        })
                    }

                })
                .catch(ex => console.log(ex))
        }
        notificationsRef.current.style.display = notificationsRef.current.style.display === "block" ? "none" : "block"
    }
    const pushHistory = (notification) => {
        const module = notification.category_id < 5 ? "/orders" : notification.category_id < 10 ? "/tender" : "/contracts";
        const subModule = notification.category_id === 1
            ? "/visas"
            : notification.category_id === 2
                ? "/my-orders"
                : "/contracts";
        const { tran_id: tranid, doc_number: docNumber } = notification;
        history.push(module + subModule, { tranid, docNumber: docNumber });
    }
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setNotifications(prev => {
            let indexStart = prev.all.findIndex(notif => notif.offset >= scrollTop);
            indexStart = indexStart >= 2 ? indexStart - 2 : 0;
            let indexEnd = prev.all.findIndex(notif => notif.offset >= scrollTop + 500);
            indexEnd = indexEnd === -1 ? prev.all.length : indexEnd + 2;
            const visible = prev.all.slice(indexStart < 0 ? 0 : indexStart, indexEnd);
            return { ...prev, visible: visible, offsetStart: indexStart < 0 ? 0 : indexStart, offsetEnd: indexEnd }
        })
    }
    const onNotificationClick = (notif) => {
        if (!notif.is_read)
            fetch(`http://192.168.0.182:54321/api/update-notifcation-state/${notif.id}`, {
                headers: {
                    "Authorization": "Bearer " + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length === 0)
                        setNotifications(prev => {
                            const all = prev.all.map(notification => notification.id === notif.id ? ({ ...notification, is_read: true }) : notification);
                            const visible = all.slice(prev.offsetStart, prev.offsetEnd)
                            return { ...prev, all, visible, count: prev.count !== 0 && prev.count !== "" ? prev.count - 1 : "" }
                        })
                })
                .catch(ex => console.log(ex))
        pushHistory(notif)
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
                            <span style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={handleNotificationsClick}>
                                <MdNotifications color="#61DAFB" size="32" />
                                {notifications.count}
                            </span>
                            <div style={{ position: "absolute", right: "10px" }}>
                                <div className="notifications-container" style={{ display: "none", marginTop: '10px' }} onScroll={handleScroll} ref={notificationsRef}>
                                    <ul style={{ height: `${notifications.height}px` }}>
                                        {
                                            notifications.visible.map(notification =>
                                                <li
                                                    key={notification.id}
                                                    style={{
                                                        transform: `translateY(${notification.offset}px)`,
                                                        right: 0,
                                                        left: 0,
                                                        backgroundColor: notification.is_read ? "rgb(68 112 156)" : ""
                                                    }}
                                                    onClick={() => onNotificationClick(notification)}
                                                >
                                                    <strong style={{ fontSize: "1.2rem" }}>{notification.full_name}</strong>
                                                    <br />
                                                    <div>
                                                        {getNotifText(notification)}
                                                    </div>
                                                    <span>{notification.date_time}</span>
                                                </li>
                                            )
                                        }
                                        <div ref={delimterRef} style={{ position: "absolute", top: `${notifications.height}px`, opacity: 0 }}>demileter</div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img style={{ height: '32px', cursor: 'pointer', width: '45px' }} onClick={handleIconClick} src={logo} alt='user pic' />
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
