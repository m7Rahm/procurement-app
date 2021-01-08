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
const updateListContent = (data, token) => fetch('http://172.16.3.101:54321/api/get-user-agreements', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + token
    },
    body: data
})
const initData = {
    fullName: '',
    result: -3,
    from: 0,
    next: 20
}
const Agreements = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [active, setActive] = useState(null);
    return (
        <div className="agreements-container" style={{ top: '-56px' }}>
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
            />
            <AgreementContent   
                token={token}
                active={active}
            />
        </div>
    )
}
export default Agreements