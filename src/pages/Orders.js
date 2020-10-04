import React, { useEffect } from 'react'
import Archived from './Orders/Archived'
import MyOrders from './Orders/MyOrders'
import Drafts from './Orders/Drafts'
import Visas from './Orders/Visas'
import {
    IoMdDocument,
    IoIosArchive,
    IoMdCheckmarkCircleOutline,
    IoMdCart
} from 'react-icons/io'
import {
    Route,
    Switch,
    useRouteMatch
} from 'react-router-dom'
const routes = [
    {
        text: 'Archived',
        link: '/archived',
        icon: IoIosArchive,
        component: Archived
    },
    {
        text: 'My Orders',
        link: '/my-orders',
        icon: IoMdCart,
        component: MyOrders
    },
    {
        text: 'Drafts',
        link: '/drafts',
        icon: IoMdDocument,
        component: Drafts
    },
    {
        text: 'Visas',
        link: '/visas',
        icon: IoMdCheckmarkCircleOutline,
        component: Visas
    }
]
const Orders = (props) => {
    const setMenuData = props.setMenuData;
    const webSocketRef = props.webSocketRef;
    const { path, url } = useRouteMatch()
    useEffect(() => {
        setMenuData({ url: url, routes: routes })
    }, [url, setMenuData])
    return (
        <div className="app">
            <Switch>
                {
                    routes.map(route =>
                        <Route key={route.link} path={`${path}${route.link}`}>
                            <route.component webSocketRef={webSocketRef} />
                        </Route>
                    )
                }
            </Switch>
        </div>
    )
}
export default Orders