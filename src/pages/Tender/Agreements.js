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
    let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&` , "");
    query = query.substring(0, query.length - 1);
    return fetch('http://172.16.3.101:54321/api/tender-docs?doctype=1&' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}
const initData = {
    result: -3,
    from: 0,
    next: 20
}
const params = {
    active: 'id',
    agreementResult: 'result',
    number: 'number',
    actionDate: 'action_date_time'
}
const referer = 'procurement'
const Agreements = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [active, setActive] = useState({
        active: null,
        userResult: null,
        agreementResult: null,
        tranid: null
    });
    return (
        <div className="agreements-container">
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
                referer={referer}
            />
        </div>
    )
}
export default Agreements