import React, { useContext, useState, lazy } from 'react'

import { TokenContext } from '../../App';
import { FaPlus } from 'react-icons/fa';
import MiscDocContainer from "../Common/MiscDocContainer";
import EmptyContent from "../Misc/EmptyContent";
import { useParams, useLocation } from "react-router-dom"
const Modal = lazy(() => import('../Misc/Modal'));
const NewBudgetRequest = lazy(() => import('../../pages/Budget/NewBudgetRequest'));
const miscDocNotifName = "miscDoc";

const MiscDocsContainer = SideBar => function MiscDocsContainer(props) {
    const { updateListContent, params, inData, referer } = props
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [initData, setInitData] = useState(inData);
    const { docid } = useParams();
    const docType = useLocation().search.match(/dt=(\d{1,3})/);
    const [active, setActive] = useState({
        active: Number(docid),
        number: '',
        docType: docType ? Number(docType[1]) : 0
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
                            docid={active.active}
                            docType={active.docType}
                            setInitData={setInitData}
                        />
                        : <div className="visa-content-container">
                            <EmptyContent />
                        </div>
                }
            </div>
            {
                referer !== "receiver" &&
                <div onClick={handleNewContractClick} style={{ position: 'fixed', bottom: '50px', right: '50px' }}>
                    <FaPlus size="28" color="#FFAE00" cursor="pointer" />
                </div>
            }
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