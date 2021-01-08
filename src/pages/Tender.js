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
    FaCartArrowDown,
    FaTasks
} from 'react-icons/fa'
import ExpressVendors from './Tender/ExpressVendors'
import PotentialVendors from './Tender/PotentialVendors'
import Orders from './Tender/Orders';
import NewAgreement from './Tender/NewAgreement';
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
        component: Orders
    },
    {
        text: 'Potential Vendors',
        link: '/potential-vendors',
        icon: FaCartArrowDown,
        component: PotentialVendors
    },
    {
        text: 'New Agreement',
        link: '/new-agreement',
        icon: FaTasks,
        component: NewAgreement
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