import React, { useEffect } from 'react'

import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import BudgetMain from './Budget/BudgetMain'
import StructureBudget from './Budget/StructureBudget'
import {
    GiReceiveMoney
} from 'react-icons/gi'
import '../styles/Budget.css'
const routes = [
    {
        text: 'Budget',
        link: '',
        icon: GiReceiveMoney,
        component: BudgetMain
    },
]
const Budget = (props) => {
    const setMenuData = props.setMenuData
    const { path, url } = useRouteMatch()
    useEffect(() => {
        setMenuData({ url: url, routes: routes })
    }, [url, setMenuData])
    return (
        <div className="dashboard">
            <Switch>
                <Route exact path={`${path}`}>
                    <BudgetMain />
                </Route>
                <Route path={`${path}/:structureid`} render={(props) => <StructureBudget {...props} />}>
                </Route>
            </Switch>
        </div>
    )
}

export default Budget