import React, { useState, useCallback } from "react"
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
    const [active, setActive] = useState({
        active: undefined,
        number: ""
    });
    const [initData, setInitData] = useState({
        result: 0,
        from: 0,
        next: 20
    });
    const fetchGet = useFetch("GET")
    const updateListContent = useCallback((data) => {
        let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
        query = query.substring(0, query.length - 1);
        return fetchGet("http://192.168.0.182:54321/api/tender-docs?doctype=1&" + query)
    }, [fetchGet]);
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