import React, { useEffect } from 'react'

import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'

import BudgetMain from './Budget/BudgetMain'
import StructureBudget from './Budget/StructureBudget'
import { GiReceiveMoney } from 'react-icons/gi'
import { GrDocumentPerformance } from 'react-icons/gr'
import { BsCardChecklist } from 'react-icons/bs'
import '../styles/Budget.css'
import GlCategories from './Budget/GlCategories'
import MiscDocsContainer from '../components/HOC/MiscDocsContainer'

import { optionsAgreements } from '../data/data'
import CardsList from '../components/HOC/CardsList'
import OrdersSearchHOC from '../components/Search/OrdersSearchHOC'
import SideBarContainer from '../components/HOC/SideBarContainer'
import AgreementCard from '../components/VisaCards/AgreementCard'

const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(SideBarContent, optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search));
const BudgetDocuments = MiscDocsContainer(SideBar)

const routes = [
    {
        text: 'Büdcə',
        link: '',
        icon: GiReceiveMoney,
        component: BudgetMain
    },
    {
        text: 'Xərc Maddələri',
        link: '/gl-categories',
        icon: BsCardChecklist,
        component: GlCategories
    },
    {
        text: 'Büdcədən Kənar Sənədlər',
        link: '/budget-docs',
        icon: GrDocumentPerformance,
        component: BudgetDocuments
    },
];
const updateListContent = (data, token) => {
    const apiData = JSON.stringify(data);
    return fetch('http://192.168.0.182:54321/api/get-sender-misc-docs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': apiData.length,
            'Authorization': 'Bearer ' + token
        },
        body: apiData
    })
}
const inData = {
    result: 0,
    from: 0,
    docType: 1
}
const params = {
    active: 'id',
    number: 'number',
    docType: "doc_type"
}
const Budget = (props) => {
    const setMenuData = props.setMenuData
    const { path, url } = useRouteMatch()
    useEffect(() => {
        setMenuData({ url: url, routes: routes })
    }, [url, setMenuData])
    return (
        <div className="dashboard">
            <Switch>
                <Route path={`${path}/gl-categories`}>
                    <GlCategories />
                </Route>
                <Route path={`${path}/budget-docs`}>
                    <BudgetDocuments
                        inData={inData}
                        params={params}
                        updateListContent={updateListContent}
                    />
                </Route>
                <Route path={`${path}/:structureid`} render={(props) => <StructureBudget {...props} />}>
                </Route>
                <Route path={`${path}`}>
                    <BudgetMain />
                </Route>
            </Switch>
        </div>
    )
}

export default Budget