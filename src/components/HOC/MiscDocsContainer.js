import React, { useContext, useState, lazy } from 'react'

import { TokenContext } from '../../App'
import { FaPlus } from 'react-icons/fa'
import MiscDocContainer from '../Common/MiscDocContainer'
import EmptyContent from '../Misc/EmptyContent'
const Modal = lazy(() => import('../Misc/Modal'))
const NewBudgetRequest = lazy(() => import('../../pages/Budget/NewBudgetRequest'))
const miscDocNotifName = "miscDoc"

const MiscDocsContainer = SideBar => function MiscDocsContainer (props) {
    const { updateListContent, params, inData } = props
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [initData, setInitData] = useState(inData);
    const [active, setActive] = useState({
        active: undefined,
        tranid: undefined,
        number: '',
        docType: undefined
    });
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleNewContractClick = () => {
        setModalState({ visible: true, content: NewBudgetRequest, setInitData: setInitData, token: token })
    }
    return (
        <div>
            <div style={{ display: 'flex', position: 'relative' }}>
                <SideBar
                    initData={initData}
                    setActive={setActive}
                    updateListContent={updateListContent}
                    token={token}
                    newDocNotifName={miscDocNotifName}
                    params={params}
                />
                {
                    active.active && active.docType
                        ? <MiscDocContainer
                            tranid={active.tranid}
                            docid={active.active}
                            docType={active.docType}
                        />
                        : <div className="visa-content-container">
                            <EmptyContent />
                        </div>
                }
            </div>
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
export default MiscDocsContainer