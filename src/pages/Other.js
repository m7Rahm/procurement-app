import React, { useCallback, useEffect, useState, useMemo } from "react"
import { Route, useLocation, useRouteMatch } from "react-router-dom"
import { optionsAgreements, miscDocTypes } from "../data/data"
import CardsList from "../components/HOC/CardsList"
import OrdersSearchHOC from "../components/Search/OrdersSearchHOC"
import SideBarContainer from "../components/HOC/SideBarContainer"
import AgreementCard from "../components/VisaCards/AgreementCard"
import MiscDocsContainer from "../components/HOC/MiscDocsContainer"
import useFetch from "../hooks/useFetch"
import { IoIosMail } from "react-icons/io"
import { SiMinutemailer } from "react-icons/si"
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));
const params = {
    active: "related_doc_id",
    tranid: "id",
    number: "number",
    docType: "type"
}
const inData = {
    result: 0,
    from: 0,
    docType: 0
}
const routes = [
    {
        text: "Gələnlər",
        link: "/inbox",
        icon: IoIosMail,
        name: "inbox",
        fetch: "http://192.168.0.182:54321/api/get-receiver-misc-docs",
        docTypes: miscDocTypes,
        inData: {
            result: 0,
            from: 0,
            docType: 0
        },
        params: {
            active: "related_doc_id",
            tranid: "id",
            number: "number",
            docType: "type"
        }
    },
    {
        text: "Göndərilənlər",
        link: "/outbox",
        icon: SiMinutemailer,
        name: "outbox",
        fetch: "http://192.168.0.182:54321/api/get-sender-misc-docs",
        inData: {
            result: 0,
            from: 0,
            docType: 1
        },
        docTypes: miscDocTypes.filter(type => type.val !== "0" && type.val !== "2"),
        params: {
            active: "id",
            number: "number",
            docType: "doc_type"
        }
    },
];
const Other = (props) => {
    const { setMenuData, loadingIndicatorRef } = props;
    const { url, path } = useRouteMatch();
    const { pathname } = useLocation()
    const [category, setCategory] = useState({ name: "inbox", link: "http://192.168.0.182:54321/api/get-receiver-misc-docs", docTypes: miscDocTypes, inData, params })
    useEffect(() => {
        let active = routes[0].link
        if (pathname.includes("outbox")) {
            setCategory({ name: routes[1].name, link: routes[1].fetch, docTypes: routes[1].docTypes, inData: routes[1].inData, params: routes[1].params });
            active = routes[1].link
        }
        loadingIndicatorRef.current.style.transform = "translateX(0%)";
        loadingIndicatorRef.current.style.opacity = "0";
        loadingIndicatorRef.current.classList.add("load-to-start");
        const handleNavigation = (route) => {
            setCategory(prev => prev.name !== route.name ? ({ name: route.name, link: route.fetch, params: route.params, docTypes: route.docTypes, inData: route.inData }) : prev)
            window.history.pushState(null, "", url + route.link)
        }
        setMenuData({ url: url, routes: routes, onNavClick: handleNavigation, active: active })
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef, setCategory, pathname]);
    const fetchPost = useFetch("POST");
    // eslint-disable-next-line
    const Inbox = useMemo(() => MiscDocsContainer(SideBar), [category.name])
    const updateListContent = useCallback((data) => fetchPost(category.link, data), [fetchPost, category.link]);
    return (
        <Route path={`${path}`}>
            <Inbox
                inData={category.inData}
                params={category.params}
                referer={category.name}
                docType={inData.docType}
                docTypes={category.docTypes}
                updateListContent={updateListContent}
            />
        </Route>
    )
}
export default Other