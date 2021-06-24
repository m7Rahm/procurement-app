import React, { useState, lazy, useEffect, useContext } from "react"

import { FaPlus } from "react-icons/fa";
import { TokenContext } from "../../App";
import MiscDocContainer from "../Common/MiscDocContainer";
import EmptyContent from "../Misc/EmptyContent";
const Modal = lazy(() => import("../Misc/Modal"));
const NewOtherDocModal = lazy(() => import("../modal content/NewOtherDocModal"));
const miscDocNotifName = "nO";

const MiscDocsContainer = SideBar => function MiscDocsContainer(props) {
    const { updateListContent, params, inData, referer, docTypes } = props
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const userData = useContext(TokenContext)[0].userData;
    let docTypesFiltered = docTypes;
    if (referer === "outbox" && userData.modules.find(module => module.text === "Budget") === undefined) {
        docTypesFiltered = docTypesFiltered.filter(type => type.val !== "1")
    }
    const [initData, setInitData] = useState(inData);
    const docidURL = window.location.search.match(/i=(\d{1,6})/)
    const docType = window.location.search.match(/dt=(\d{1,3})/);
    const docid = docidURL ? docidURL[1] : undefined
    const dType = docType ? Number(docType[1]) : 0;
    const [active, setActive] = useState({
        active: Number(docid),
        number: "",
        docType: dType
    });
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleNewMiscDocClick = () => {
        setModalState({ visible: true, content: NewOtherDocModal, setInitData: setInitData, docType: dType, docTypes: docTypesFiltered })
    }
    useEffect(() => {
        let mounted = true
        if (Number(docid) && window.history.state && mounted) {
            setActive({
                active: docid,
                number: "",
                docType: dType
            })
        }
        return () => mounted = false
    }, [docid, dType])
    return (
        <div>
            <div style={{ display: "flex", position: "relative" }}>
                <SideBar
                    initData={initData}
                    setActive={setActive}
                    updateListContent={updateListContent}
                    newDocNotifName={miscDocNotifName}
                    params={params}
                    docTypes={docTypesFiltered}
                />
                <div className="visa-content-container">
                    {
                        active.active && active.docType
                            ? <MiscDocContainer
                                docid={active.active}
                                docType={active.docType}
                                setInitData={setInitData}
                                referer={referer}
                            />
                            : <EmptyContent />
                    }
                </div>
            </div>
            {
                referer === "outbox" &&
                <div onClick={handleNewMiscDocClick} style={{ position: "fixed", bottom: "50px", right: "50px", zIndex: "2" }}>
                    <FaPlus size="28" color="#FFAE00" cursor="pointer" />
                </div>
            }
            {
                modalState.visible &&
                <Modal style={{ width: "40rem", minWidth: "0px", minHeight: "25rem" }} title="_" childProps={modalState} changeModalState={closeModal}>
                    {modalState.content}
                </Modal>
            }
        </div>
    )
}
export default MiscDocsContainer