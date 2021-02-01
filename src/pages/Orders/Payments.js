import React, { useState, useContext } from 'react'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
import AgreementCard from '../../components/VisaCards/AgreementCard'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import CardsList from '../../components/HOC/CardsList'
import { TokenContext } from '../../App'
import PaymentContent from '../../components/Orders/Contracts/PaymentContent'
import { optionsAgreements } from '../../data/data'
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(SideBarContent, optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search));
const updateListContent = (data, token) => {
    const apiData = JSON.stringify(data);
    return fetch('http://172.16.3.101:54321/api/get-user-payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': apiData.length,
            'Authorization': 'Bearer ' + token
        },
        body: apiData
    })
}
const initData = {
    number: '',
    result: -3,
    from: 0,
    next: 20
}
const params = {
    active: 'message_id',
    userResult: 'user_result',
    agreementResult: 'agreement_result',
    tranid: 'id',
    actionDate: 'action_date_time'
}
const Payments = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [active, setActive] = useState({
        active: null,
        userResult: undefined,
        agreementResult: undefined,
        tranid: null
    });
    const apiString = active.active ? `http://172.16.3.101:54321/api/doc-content?doctype=3&docid=${active.active}` : ''
    return (
        <div className="agreements-container" style={{ top: '-56px' }}>
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
                params={params}
            />
            <PaymentContent
                token={token}
                current={active}
                apiString={apiString}
                setActive={setActive}
            />
        </div>
    )
}
export default Payments