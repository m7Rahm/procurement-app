import React, { useEffect } from 'react'

import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import Contracts from './Contracts/Contracts'
import ExpressContracts from './Contracts/ExpressContracts'
import { FaFileContract, FaHandshake } from 'react-icons/fa'
import { MdPayment } from 'react-icons/md'
import Payments from './Contracts/Payments'
import '../styles/Tender.css'

const routes = [
    {
        text: 'Müqavilə razılaşmaları',
        link: '/contracts',
        icon: FaHandshake,
        component: Contracts
    },
    {
        text: 'Müqavilələr',
        link: '/express-contracts',
        icon: FaFileContract,
        component: ExpressContracts
    },
    {
        text: 'Ödəniş razılaşmaları',
        link: '/payments',
        icon: MdPayment,
        component: Payments
    }
]
const ContractsModule = (props) => {
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
                            <route.component />
                        </Route>
                    )
                }
            </Switch>
        </div>
    )
}

export default ContractsModule