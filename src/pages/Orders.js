import React, { useEffect } from 'react'
import MyOrders from './Orders/MyOrders'
import Visas from './Orders/Visas'
import Returned from './Orders/Returned'
import Agreements from './Orders/Agreements'
import Payments from './Orders/Payments'
import {
    IoMdDocument,
    IoMdCheckmarkCircleOutline,
    IoMdCart
} from 'react-icons/io'
import { FaHandshake } from 'react-icons/fa'
import {
    Route,
    Switch,
    useRouteMatch
} from 'react-router-dom'
import { MdPayment } from 'react-icons/md'
import '../styles/Orders.css'
import Contracts from './Orders/Contracts'
const routes = [
    {
        text: 'Sifarişlərim',
        link: '/my-orders',
        icon: IoMdCart,
        component: MyOrders
    },
    {
        text: 'Redaktəyə qaytarılmış',
        link: '/returned',
        icon: IoMdDocument,
        component: Returned
    },
    {
        text: 'Vizalar',
        link: '/visas',
        icon: IoMdCheckmarkCircleOutline,
        component: Visas
    },
    {
        text: 'Q/T razılaşmaları',
        link: '/agreements',
        icon: IoMdCart,
        component: Agreements
    },
    {
        text: 'Müqavilə razılaşmaları',
        link: '/contracts',
        icon: FaHandshake,
        component: Contracts
    },
    {
        text: 'Ödəniş razılaşmaları',
        link: '/payments',
        icon: MdPayment,
        component: Payments
    }
]
const Orders = (props) => {
    const setMenuData = props.setMenuData;
    const { path, url } = useRouteMatch()
    useEffect(() => {
        setMenuData({ url: url, routes: routes });
    }, [url, setMenuData]);
    return (
        <div className="app dashboard">
            <Switch>
                {
                    routes.map(route =>
                        <Route key={route.link} path={`${path}${route.link}`}>
                            <route.component />
                        </Route>
                    )
                }
            </Switch>
        </div>
    )
}
export default Orders