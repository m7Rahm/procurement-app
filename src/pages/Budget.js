import React, { useContext } from 'react'

import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import BudgetMain from './Budget/BudgetMain'
import StructureBudget from './Budget/StructureBudget'
import { TokenContext } from '../App'
import LeftSidePane from '../components/LeftSidePane'
import {
    GiReceiveMoney
} from 'react-icons/gi'
const routes = [
    {
        text: 'Budget',
        link: '',
        icon: GiReceiveMoney,
        component: BudgetMain
    },
]
const Budget = (props, ref) => {
    const tokenContext = useContext(TokenContext)
    const token = tokenContext[0];
    const { path, url } = useRouteMatch()
    return (
        <>
            <LeftSidePane url={url} links={routes} ref={ref} handleNavClick={props.handleNavClick} />
            <Switch>
                <Route exact path={`${path}`}>
                    <BudgetMain token={token} />
                </Route>
                <Route path={`${path}/:structureid`} render={(props) => <StructureBudget token={token} {...props} />}>
                </Route>
            </Switch>
        </>
    )
}

export default React.forwardRef(Budget)