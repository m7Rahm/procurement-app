import React, { useContext, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import { TokenContext } from '../../App'
import SideBarWithSearch from '../../components/HOC/SideBarWithSearch'
const SideBarContent = CardsList(ReadyOfferCard);
const WithSearch = SideBarWithSearch(SideBarContent);
const SideBar = React.memo(SideBarContainer(WithSearch));
const updateListContent = (data, token) => fetch('http://172.16.3.101:54321/api/get-ready-orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + token
    },
    body: data
})
const initData = {
    userName: '',
    startDate: null,
    endDate: null,
    docType: -3,
    from: 0,
    until: 20
}
const Agreements = () => {
    const [active, setActive] = useState(null);
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    return (
        <div style={{ textAlign: 'center', background: 'transparent', minHeight: '100vh', display: 'flex' }}>
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
            />
            {/* <AgreementContent/> */}
        </div>
    )
}
export default Agreements