import React, { useState, useCallback, useEffect } from "react"
import AgreementCard from "../../components/VisaCards/AgreementCard"
import SideBarContainer from "../../components/HOC/SideBarContainer"
import OrdersSearchHOC from "../../components/Search/OrdersSearchHOC"
import CardsList from "../../components/HOC/CardsList"
import AgreementContent from "../../components/Orders/Agreements/AgreementContent"
import { optionsAgreements } from "../../data/data"
import useFetch from "../../hooks/useFetch"
const SideBarContent = CardsList(AgreementCard);
const Search = React.memo(OrdersSearchHOC(optionsAgreements));
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));
const Agreements = (props) => {
    const { link, method } = props;
    const index = window.location.search.indexOf("i=")
    const orderid = index !== -1 ? window.location.search.substring(index + 2) : undefined
    const [active, setActive] = useState({
        active: Number(orderid),
        number: ""
    });
    useEffect(() => {
        if (Number(orderid) && window.history.state)
            setActive({
                active: orderid,
                number: ""
            })
    }, [orderid])
    const [initData, setInitData] = useState({
        result: 0,
        from: 0,
        next: 20
    });
    const fetchGet = useFetch("GET")
    const fetchPost = useFetch("POST")
    const updateListContent = useCallback((data) => {
        if (method === "POST")
            return fetchPost(link, data)
        else if (method === "GET") {
            let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
            query = query.substring(0, query.length - 1);
            return fetchGet(link + query)
        }
    }, [link, method, fetchGet, fetchPost])

    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                newDocNotifName={props.newDocNotifName}
                params={props.params}
            />
            <AgreementContent
                docid={active.active}
                setActive={setActive}
                number={active.number}
                setInitData={setInitData}
                referer={props.referer}
            />
        </div>
    )
}
export default Agreements