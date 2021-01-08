import React, { useEffect } from 'react'
import MyOrders from './Orders/MyOrders'
import Visas from './Orders/Visas'
import Returned from './Orders/Returned'
import Agreements from './Orders/Agreements'
import {
    IoMdDocument,
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
        text: 'My Orders',
        link: '/my-orders',
        icon: IoMdCart,
        component: MyOrders
    },
    {
        text: 'Retruned',
        link: '/returned',
        icon: IoMdDocument,
        component: Returned
    },
    {
        text: 'Visas',
        link: '/visas',
        icon: IoMdCheckmarkCircleOutline,
        component: Visas
    },
    {
        text: 'Agreements',
        link: '/agreements',
        icon: IoMdCart,
        component: Agreements
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
        <div className="app dashboard">
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