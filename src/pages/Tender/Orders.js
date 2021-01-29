import React, { useContext, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import { TokenContext } from '../../App'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
import AgreementContent from '../../components/Tender/AgreementContent'
const SideBarContent = CardsList(ReadyOfferCard);
const WithSearch = OrdersSearchHOC(SideBarContent);
const SideBar = React.memo(SideBarContainer(WithSearch));
const updateListContent = (data, token) => {
    const apiData = JSON.stringify(data);
    return fetch('http://172.16.3.101:54321/api/get-ready-orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': apiData.length,
            'Authorization': 'Bearer ' + token
        },
        body: apiData
    })
}
const init = {
    userName: '',
    startDate: null,
    endDate: null,
    docType: -3,
    from: 0,
    until: 20
}
const Orders = () => {
    const [active, setActive] = useState(null);
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [updateCards, setUpdateCards] = useState(false)
    return (
        <div className="agreements-container">
            <SideBar
                initData={init}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
                updateCards={updateCards}
            />
            <AgreementContent
                active={active}
                setUpdateCards={setUpdateCards}
                token={token}
            />
        </div>
    )
}
export default Orders