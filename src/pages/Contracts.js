import React, { useEffect } from 'react'

import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import ContPay from './Contracts/Contracts'
import { FaFileContract, FaHandshake } from 'react-icons/fa'

const routes = [
    {
        text: 'Müqavilə razılaşmaları',
        link: '',
        icon: FaHandshake,
        component: ContPay
    },
    {
        text: 'Müqavilələr',
        link: '',
        icon: FaFileContract,
        component: ContPay
    },
]
const Contracts = (props) => {
    const setMenuData = props.setMenuData
    const { path, url } = useRouteMatch()
    useEffect(() => {
        setMenuData({ url: url, routes: routes })
    }, [url, setMenuData])
    return (
        <div className="dashboard">
            <Switch>
                {
                    routes.map(route =>
                        <Route key={route.link} path={`${path}${route.link}`}>
                            <route.component webSocketRef={props.webSocketRef} />
                        </Route>
                    )
                }
            </Switch>
        </div>
    )
}

export default Contracts