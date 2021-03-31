import React, { useState, useContext } from "react"
import AgreementCard from "../../components/VisaCards/AgreementCard"
import SideBarContainer from "../../components/HOC/SideBarContainer"
import OrdersSearchHOC from "../../components/Search/OrdersSearchHOC"
import CardsList from "../../components/HOC/CardsList"
import { TokenContext } from "../../App"
import AgreementContent from "../../components/Orders/Agreements/AgreementContent"
import { optionsAgreements } from "../../data/data"
const SideBarContent = CardsList(AgreementCard);
const Search = React.memo(OrdersSearchHOC(optionsAgreements));
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));
const Agreements = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [active, setActive] = useState({
        active: undefined,
        number: ""
    });
    const [initData, setInitData] = useState({
        result: 0,
        from: 0,
        next: 20
    });
    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={props.updateListContent}
                token={token}
                params={props.params}
            />
            <AgreementContent
                token={token}
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