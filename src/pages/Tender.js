import React, { useEffect } from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import { MdLocalOffer } from 'react-icons/md'
import { FaCartArrowDown, FaTasks } from 'react-icons/fa'
import { IoIosDocument, IoIosBulb } from 'react-icons/io'
import ExpressVendors from './Tender/ExpressVendors'
import PotentialVendors from './Tender/PotentialVendors'
import Orders from './Tender/Orders';
import '../styles/Tender.css'
import NewAgreement from './Tender/NewAgreement';
import Agreements from './Tender/Agreements';
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
        icon: IoIosBulb,
        component: PotentialVendors
    },
    {
        text: 'Agreements',
        link: '/agreements',
        icon: FaTasks,
        component: Agreements
    },
    {
        text: 'New Agreement',
        link: '/new-agreement',
        icon: IoIosDocument,
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