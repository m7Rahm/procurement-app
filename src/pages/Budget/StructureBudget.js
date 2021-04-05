import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import StructureBudgetDetailed from '../../components/Budget/StructureBudgetDetailed'
import { IoIosArrowBack } from 'react-icons/io'
import StructureBudgetCard from '../../components/Budget/StructureBudgetCard'
import useFetch from '../../hooks/useFetch'
const StructureBudget = (props) => {
    const params = useParams();
    const history = useHistory();
    const [structureBudget, setStructureBudget] = useState({ budgets: [], count: 0 });
    const state = props.location.state;
    const searchState = state ? state.searchState : undefined;
    const { structureid } = params;
    const { path } = useRouteMatch()
    const structureName = state ? state.structure.name : undefined
    const fetchPost = useFetch("POST");
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
                glCategoryid: 0
            };
            fetchPost(`http://192.168.0.182:54321/api/structure-budget-per-gl-category`, data)
                .then(respJ => {
                    const totalCount = respJ[0] ? respJ[0].total_count : 0;
                    setStructureBudget({ count: totalCount, budgets: respJ });
                })
                .catch(ex => console.log(ex))
        }
    }, [structureid, searchState, fetchPost]);
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