import React, { useEffect } from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import {
    MdLocalOffer
} from 'react-icons/md'
import {
    FaCartArrowDown
} from 'react-icons/fa'
import ExpressVendors from './Tender/ExpressVendors'
import Inbox from './Tender/Inbox'
import PotentialVendors from './Tender/PotentialVendors'
const routes = [
    {
        text: 'Express Vendors',
        link: '/express-vendors',
        icon: MdLocalOffer,
        component: ExpressVendors
    },
    {
        text: 'Orders',
        link: '/orders',
        icon: FaCartArrowDown,
        component: Inbox
    },
    {
        text: 'Potential Vendors',
        link: '/potential-vendors',
        icon: FaCartArrowDown,
        component: PotentialVendors
    }
]
const Tender = (props) => {
    const setMenuData = props.setMenuData;
    const { path, url } = useRouteMatch();
    useEffect(() => {
        setMenuData({ url: url, routes: routes })
    }, [url, setMenuData])
    return (
        <Switch>
            {
                routes.map(route =>
                    <Route key={route.link} path={`${path}${route.link}`}>
                        <route.component />
                    </Route>
                )
            }
        </Switch>
    )
}

export default Tender