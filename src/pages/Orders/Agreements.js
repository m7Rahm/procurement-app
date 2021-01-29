import React, { useState, useContext } from 'react'
import SideBarWithSearch from '../../components/HOC/SideBarWithSearch'
import AgreementCard from '../../components/VisaCards/AgreementCard'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import CardsList from '../../components/HOC/CardsList'
import { TokenContext } from '../../App'
import AgreementContent from '../../components/Orders/Agreements/AgreementContent'
const SideBarContent = CardsList(AgreementCard);
const Search = SideBarWithSearch(SideBarContent);
const SideBar = React.memo(SideBarContainer(Search));
const updateListContent = (data, token) => {
    const apiData = JSON.stringify(data);
    return fetch('http://172.16.3.101:54321/api/get-user-agreements', {
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
    fullName: '',
    result: -3,
    from: 0,
    next: 20
}
const params = {
    active: 'message_id',
    userResult: 'user_result',
    agreementResult: 'agreement_result',
    tranid: 'id',
    actionDate: 'action_date_time',
    number: 'number'
}
const Agreements = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [active, setActive] = useState({
        active: null,
        userResult: null,
        agreementResult: null,
        tranid: null,
        number: ''
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
                current={active}
                setActive={setActive}
            />
        </div>
    )
}
export default Agreements