import React, { useState, useContext, lazy } from 'react'
import SideBarWithSearch from '../../components/HOC/SideBarWithSearch'
import AgreementCard from '../../components/VisaCards/AgreementCard'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import CardsList from '../../components/HOC/CardsList'
import { TokenContext } from '../../App'
import PaymentContent from '../../components/Orders/Contracts/PaymentContent'
import { FaPlus } from 'react-icons/fa'
import { optionsAgreements } from '../../data/data'
const Modal = lazy(() => import('../../components/Misc/Modal'))
const NewPayment = lazy(() => import('../../components/Contracts/NewPayment'))
const SideBarContent = CardsList(AgreementCard);
const Search = SideBarWithSearch(SideBarContent, optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search));
const updateListContent = (data, token) => {
    let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
    query = query.substring(0, query.length - 1);
    return fetch('http://172.16.3.101:54321/api/tender-docs?doctype=3&' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}
const inData = {
    result: -3,
    from: 0,
    next: 20
}
const params = {
    active: 'id',
    agreementResult: 'result'
}
const Payments = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [initData, setInitData] = useState(inData)
    const [active, setActive] = useState({
        active: null,
        userResult: null,
        agreementResult: null,
        tranid: null
    });
    const apiString = active.active ? `http://172.16.3.101:54321/api/doc-content?doctype=3&docid=${active.active}` : ''
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleNewContractClick = () => {
        setModalState({ visible: true, content: NewPayment, updateCards: setInitData })
    }
    return (
        <div className="agreements-container" style={{ overflow: 'auto' }}>
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
                referer="procurement"
                apiString={apiString}
                setActive={setActive}
            />
            <div onClick={handleNewContractClick} style={{ position: 'fixed', bottom: '50px', right: '50px' }}>
                <FaPlus size="28" color="#FFAE00" cursor="pointer" />
            </div>
            {
                modalState.visible &&
                <Modal childProps={modalState} changeModalState={closeModal}>
                    {modalState.content}
                </Modal>
            }
        </div>
    )
}
export default Payments