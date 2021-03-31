import React, { useEffect } from "react"
import {
    Route,
    useRouteMatch
} from "react-router-dom"
import { optionsAgreements, miscDocTypes } from "../data/data"
import CardsList from "../components/HOC/CardsList"
import OrdersSearchHOC from "../components/Search/OrdersSearchHOC"
import SideBarContainer from "../components/HOC/SideBarContainer"
import AgreementCard from "../components/VisaCards/AgreementCard"
import MiscDocsContainer from "../components/HOC/MiscDocsContainer"
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(optionsAgreements, miscDocTypes);
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));
const Inbox = MiscDocsContainer(SideBar)

const updateListContent = (data, token) => {
    const apiData = JSON.stringify(data);
    return fetch("http://192.168.0.182:54321/api/get-receiver-misc-docs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": apiData.length,
            "Authorization": "Bearer " + token
        },
        body: apiData
    })
}
const inData = {
    result: 0,
    from: 0,
    docType: 0
}
const params = {
    active: "related_doc_id",
    tranid: "id",
    number: "number",
    docType: "type"
}

const routes = [];
const Other = (props) => {
    const setMenuData = props.setMenuData;
    const { url, path } = useRouteMatch()
    useEffect(() => {
        setMenuData({ url: url, routes: routes })
    }, [url, setMenuData])
    return (
        <Route path={`${path}/:docid?`}>
            <div className="dashboard">
                <Inbox
                    inData={inData}
                    params={params}
                    referer="receiver"
                    docType={inData.docType}
                    updateListContent={updateListContent}
                />
            </div>
        </Route>
    )
}
export default Other