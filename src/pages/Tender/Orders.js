import React, { useRef, useState } from 'react'
import ReadyOfferCard from '../../components/VisaCards/ReadyOfferCard'
import CardsList from '../../components/HOC/CardsList'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
import AgreementContent from '../../components/Tender/AgreementContent'
import { optionsReadyOrders } from '../../data/data'
import useFetch from '../../hooks/useFetch'
const SideBarContent = CardsList(ReadyOfferCard);
const WithSearch = OrdersSearchHOC(optionsReadyOrders);
const SideBar = React.memo(SideBarContainer(WithSearch, SideBarContent));

const init = {
    userName: '',
    startDate: null,
    endDate: null,
    result: 0,
    from: 0,
    until: 20
}
const Orders = () => {
    const [active, setActive] = useState({ id: null, basedOn: "", ordNumb: "", departmentName: "" });
    const searchStateRef = useRef({ result: 0 });
    const [initData, setInitData] = useState(init);
    const fetchPost = useFetch("POST");
    const updateListContent = (data) => fetchPost('http://192.168.0.182:54321/api/get-ready-orders', data)
    return (
        <div className="agreements-container">
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                searchStateRef={searchStateRef}
            />
            <AgreementContent
                active={active.id}
                searchStateRef={searchStateRef}
                setInitData={setInitData}
                ordNumb={active.ordNumb}
                basedOn={active.basedOn}
                departmentName={active.departmentName}
            />
        </div>
    )
}
export default Orders