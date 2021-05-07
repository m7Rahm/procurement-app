import React, { useContext, useState, lazy, useEffect } from "react"

import { TokenContext } from "../../App";
import { FaPlus } from "react-icons/fa";
import MiscDocContainer from "../Common/MiscDocContainer";
import EmptyContent from "../Misc/EmptyContent";
const Modal = lazy(() => import("../Misc/Modal"));
const NewBudgetRequest = lazy(() => import("../../pages/Budget/NewBudgetRequest"));
const miscDocNotifName = "nO";

const MiscDocsContainer = SideBar => function MiscDocsContainer(props) {
    const { updateListContent, params, inData, referer } = props
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [initData, setInitData] = useState(inData);
    const docidURL = window.location.search.match(/i=(\d{1,6})/)
    const docType = window.location.search.match(/dt=(\d{1,3})/);
    const docid = docidURL ? docidURL[1] : undefined
    const dType = docType ? Number(docType[1]) : 0
    useEffect(() => {
        if (Number(docid))
            setActive({
                active: docid,
                number: "",
                docType: dType
            })
    }, [docid, dType])
    const [active, setActive] = useState({
        active: Number(docid),
        number: "",
        docType: dType
    });
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleNewContractClick = () => {
        setModalState({ visible: true, content: NewBudgetRequest, setInitData: setInitData, token: token })
    }
    useEffect(() => {
        if (Number(docid) && window.history.state) {
            setActive({
                active: docid,
                number: "",
                docType: dType
            })
        }
    }, [docid, dType])
    return (
        <div>
            <div style={{ display: "flex", position: "relative" }}>
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
                <div onClick={handleNewContractClick} style={{ position: "fixed", bottom: "50px", right: "50px" }}>
                    <FaPlus size="28" color="#FFAE00" cursor="pointer" />
                </div>
            }
            {
                modalState.visible &&
                <Modal title="Büdcə Artımı razılaşması" childProps={modalState} changeModalState={closeModal}>
                    {modalState.content}
                </Modal>
            }
        </div>
    )
}
export default MiscDocsContainer