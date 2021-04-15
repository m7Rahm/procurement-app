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
import useFetch from '../hooks/useFetch'
import BudgetReport from './Budget/BudgetReport'

const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));
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
    {
        text: 'Reportlar',
        link: '/reports',
        icon: GrDocumentPerformance,
        component: BudgetReport
    },
];
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
    const { setMenuData, loadingIndicatorRef } = props
    const { path, url } = useRouteMatch();
    useEffect(() => {
        loadingIndicatorRef.current.style.transform = "translateX(0%)";
        loadingIndicatorRef.current.style.opacity = "0";
        loadingIndicatorRef.current.classList.add("load-to-start");
        setMenuData({ url: url, routes: routes });
        props.leftNavRef.current.style.display = "block";
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef]);
    const fetchSenderMiscDocs = useFetch("POST");
    const updateListContent = (data) => fetchSenderMiscDocs('http://192.168.0.182:54321/api/get-sender-misc-docs', data)
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
                <Route path={`${path}/reports`}>
                    <BudgetReport />
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