import React, { useState, useContext, useRef } from 'react'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
import AgreementCard from '../../components/VisaCards/AgreementCard'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import CardsList from '../../components/HOC/CardsList'
import { TokenContext } from '../../App'
import AgreementContent from '../../components/Orders/Agreements/AgreementContent'
import { optionsAgreements } from '../../data/data'
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(SideBarContent, optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search));
const updateListContent = (data, token) => {
    let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
    query = query.substring(0, query.length - 1);
    return fetch('http://192.168.0.182:54321/api/tender-docs?doctype=1&' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}
const params = {
    active: 'id',
    number: 'number'
}
const referer = 'procurement'
const Agreements = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const searchStateRef = useRef({ result: 0 });
    const [initData, setInitData] = useState({
        result: 0,
        from: 0,
        next: 20
    });
    const [active, setActive] = useState({
        active: undefined,
        tranid: undefined
    });
    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
                searchStateRef={searchStateRef}
                params={params}
            />
            <AgreementContent
                token={token}
                docid={active.active}
                searchStateRef={searchStateRef}
                setInitData={setInitData}
                tranid={active.tranid}
                setActive={setActive}
                number={active.number}
                referer={referer}
            />
        </div>
    )
}
export default Agreements