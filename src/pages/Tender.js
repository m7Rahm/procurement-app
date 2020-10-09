import React, { useEffect } from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom';
import {
    MdLocalOffer
} from 'react-icons/md'
import ExpressVendors from './Tender/ExpressVendors'
const routes = [
    {
        text: 'Express Vendor',
        link: '/express-vendors',
        icon: MdLocalOffer,
        component: ExpressVendors
    },
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