import React, { useState, useEffect, useContext } from 'react'
import {
    useParams, useHistory, Switch, Route, useRouteMatch
} from 'react-router-dom'
import StructureBudgetDetailed from '../../components/StructureBudgetDetailed'
import {
    IoIosArrowBack
} from 'react-icons/io'
import StructureBudgetCard from '../../components/StructureBudgetCard'
import { TokenContext } from '../../App'
const StructureBudget = (props) => {
    const params = useParams();
    const tokenContext = useContext(TokenContext)
    const history = useHistory();
    const [structureBudget, setStructureBudget] = useState({ budgets: [], count: 0 });
    const state = props.location.state;
    const searchState = state ? state.searchState : undefined;
    const {structureid, filialid } = params;
    const { path } = useRouteMatch()
    const structureName = state ? state.structure.name : undefined
    const token = tokenContext[0];
    const handleBackNavigation = () => {
        history.goBack(state)
    }
    useEffect(() => {
        if (searchState) {
            const data = {
                from: 0,
                next: 20,
                period: searchState.year + searchState.month,
                glCategoryId: 0,
                structureid,
                filialid,
                glCategoryid: 0
            };
            fetch(`http://172.16.3.101:54321/api/structure-budget-per-gl-category`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(respJ => {
                    const totalCount = respJ[0] ? respJ[0].total_count : 0;
                    setStructureBudget({ count: totalCount, budgets: respJ });
                })
                .catch(ex => console.log(ex))
        }
    }, [structureid, searchState, token, filialid]);
    // console.log(structureBudget)
    return (
        <div className="budget strucutre-budget">
            <div>
                <div className="budget-navigation-ribbon">
                    <IoIosArrowBack title="Geriyə" onClick={handleBackNavigation} size="30" />
                    <h1>{structureName}</h1>
                </div>
                <Switch>
                    <Route path={`${path}/info`}>
                        <StructureBudgetDetailed />
                    </Route>
                    <Route path={`${path}`}>
                        <ul className="structure-budget-general">
                            {
                                structureBudget.budgets.map((budget, index) =>
                                    <StructureBudgetCard
                                        key={index}
                                        state={state}
                                        index={index + 1}
                                        budget={budget}
                                        period={searchState.year + searchState.month}
                                    />
                                )
                            }
                        </ul>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}
export default StructureBudget