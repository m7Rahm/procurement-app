import React, { useState, useContext, lazy } from 'react'
import OrdersSearchHOC from '../../components/Search/OrdersSearchHOC'
import AgreementCard from '../../components/VisaCards/AgreementCard'
import SideBarContainer from '../../components/HOC/SideBarContainer'
import CardsList from '../../components/HOC/CardsList'
import { TokenContext } from '../../App'
import ContractContent from '../../components/Orders/Contracts/ContractContent'
import { FaPlus } from 'react-icons/fa'
import { optionsAgreements } from '../../data/data'
const Modal = lazy(() => import('../../components/Misc/Modal'))
const NewContract = lazy(() => import('../../components/Contracts/NewContract'))
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(SideBarContent, optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search));
const updateListContent = (data, token) => {
    let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
    query = query.substring(0, query.length - 1);
    return fetch('http://192.168.0.182:54321/api/tender-docs?doctype=2&' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
}
const inData = {
    number: '',
    result: 0,
    from: 0,
    next: 20
}
const params = {
    active: 'id',
}
const Contracts = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [initData, setInitData] = useState(inData)
    const [active, setActive] = useState({
        active: undefined,
        tranid: undefined
    });
    const apiString = active.active ? `http://192.168.0.182:54321/api/doc-content?doctype=2&docid=${active.active}` : ''
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleNewContractClick = () => {
        setModalState( { visible: true, content: NewContract, setInitData: setInitData })
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
            <ContractContent
                token={token}
                docid={active.active}
                tranid={active.tranid}
                referer="procurement"
                apiString={apiString}
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
export default Contracts