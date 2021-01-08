import React, { useContext, useEffect, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import { TokenContext } from '../../App'
import SideBarWithSearch from '../../components/HOC/SideBarWithSearch'
import AgreementContent from '../../components/Tender/AgreementContent'
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
const Orders = () => {
    const [active, setActive] = useState(null);
    const tokenContext = useContext(TokenContext);
    const [expressVendors, setExpressVendors] = useState([]);
    const token = tokenContext[0].token;
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-express-vendors', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                setExpressVendors(respJ)
            })
            .catch(ex => console.log(ex))
    }, [token]);
    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                token={token}
            />
            <AgreementContent
                expressVendors={expressVendors}
                active={active}
                token={token}
            />
        </div>
    )
}
export default Orders