import React, { useState, useContext } from 'react'
import AgreementCard from '../../components/VisaCards/AgreementCard'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
import CardsList from '../../components/HOC/CardsList'
import { TokenContext } from '../../App'
import AgreementContent from '../../components/Orders/Agreements/AgreementContent'
import { optionsAgreements } from '../../data/data'
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(SideBarContent, optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search));
const updateListContent = (data, token) => {
    const apiData = JSON.stringify(data);
    return fetch('http://192.168.0.182:54321/api/get-user-agreements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': apiData.length,
            'Authorization': 'Bearer ' + token
        },
        body: apiData
    })
}

const params = {
    active: 'message_id',
    tranid: 'id',
    number: 'number'
}
const Agreements = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [active, setActive] = useState({
        active: undefined,
        tranid: undefined,
        number: ''
    });
    const [initData, setInitData] = useState({
        result: 0,
        from: 0,
        next: 20
    });
    return (
        <div className="agreements-container" style={{ top: '-56px' }}>
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
                params={params}
            />
            <AgreementContent
                token={token}
                docid={active.active}
                tranid={active.tranid}
                setActive={setActive}
                number={active.number}
                setInitData={setInitData}
            />
        </div>
    )
}
export default Agreements