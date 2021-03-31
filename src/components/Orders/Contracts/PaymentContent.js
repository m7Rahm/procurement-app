import React, { useState, useEffect, useCallback, useRef, lazy, useContext } from "react"
import { FaCheck, FaTimes } from "react-icons/fa";
import Chat from "../../Misc/Chat"
import EmptyContent from "../../Misc/EmptyContent"
import { MdDetails } from "react-icons/md"
import { ContractFiles } from "./ContractContent"
import RightInfoBar from "../../Misc/RightInfoBar";
import AgreementGeneralInfo from "./AgreementGeneralInfo"
import PaymentMaterials from "./PaymentMaterials"
import { WebSocketContext } from "../../../pages/SelectModule";

const Modal = lazy(() => import("../../Misc/Modal"));
const AreYouSure = lazy(() => import("../../modal content/AreYouSure"))
const Participants = lazy(() => import("../../Common/ParticipantsUniversal"));
const PaymentContent = (props) => {
    const [paymentDetails, setPaymentDetails] = useState({ content: [], active: false });
    const [rightPanel, setRightPanel] = useState({ visible: false, id: null });
    const [modalState, setModalState] = useState({ visible: false })
    const textareaRef = useRef(null);
    const webSocket = useContext(WebSocketContext);
    const docid = props.docid;
    const documentType = 3;
    const fetchParticipants = () => fetch(`http://192.168.0.182:54321/api/doc-participants?id=${docid}&doctype=${documentType}`, {
        headers: {
            "Authorization": "Bearer " + props.token
        }
    });
    useEffect(() => {
        let mounted = true;
        if (props.apiString && mounted)
            fetch(props.apiString, {
                headers: {
                    "Authorization": "Bearer " + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (mounted)
                        setPaymentDetails({
                            content: respJ,
                            active: respJ[0].doc_result === 0 && (respJ[0].user_result === 0 || respJ[0].user_result === undefined)
                        })
                })
        return () => mounted = false;
    }, [props.apiString, props.token]);
    const sendMessage = useCallback((data) => {
        const apiData = JSON.stringify({ ...data, docType: documentType });
        return fetch(`http://192.168.0.182:54321/api/send-message`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + props.token,
                "Content-Type": "application/json",
                "Content-Length": apiData.length
            },
            body: apiData
        })
    }, [props.token, documentType]);
    const fetchMessages = useCallback((from = 0) =>
        fetch(`http://192.168.0.182:54321/api/messages/${docid}?from=${from}&replyto=0&doctype=${documentType}`, {
            headers: {
                "Authorization": "Bearer " + props.token
            }
        })
        , [docid, props.token, documentType]);
    const cancel = () => {
        const cancelPayment = () => {
            fetch(`http://192.168.0.182:54321/api/cancel-doc/${docid}?type=3`, {
                headers: {
                    "Authorization": "Bearer " + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length === 0) {
                        setPaymentDetails(prev => ({ content: prev.content.map(detail => ({ ...detail, doc_result: -1 })), active: false }));
                        closeModal();
                        props.setInitData(prev => ({ ...prev }))
                    }
                })
                .catch(ex => console.log(ex))
        }
        setModalState({
            visible: true,
            style: {
                width: "600px",
                minWidth: "auto"
            },
            content: AreYouSure,
            text: "Razılaşmanı imtina etməyə",
            onCancel: closeModal,
            onAccept: cancelPayment
        })
    }
    const acceptDeclince = (action) => {
        const data = JSON.stringify({
            tranid: paymentDetails.content[0].id,
            messageType: documentType,
            messageid: docid,
            action: action,
            comment: textareaRef.current.value
        })
        fetch("http://192.168.0.182:54321/api/accept-decline-doc", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + props.token,
                "Content-Type": "application/json",
                "Content-Length": data.length
            },
            body: data
        })
            .then(resp => resp.ok ? resp.json() : new Error("Internal Server Error"))
            .then(respJ => {
                if (respJ.length !== 0) {
                    const message = {
                        message: "notification",
                        receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: receiver.next_id !== 0 ? "nP" : "sNot" })),
                        data: undefined
                    }
                    webSocket.send(JSON.stringify(message))
                }
                setPaymentDetails(prev => ({ active: false, content: prev.content.map(row => ({ ...row, user_result: action })) }))
                props.setInitData(prev => ({ ...prev }))
            })
            .catch(ex => console.log(ex))
    }
    const showHistory = () => {
        setModalState({ visible: true, fetchParticipants: fetchParticipants, content: Participants })
    }
    const closeModal = () => {
        setModalState({ visible: false })
    }
    const fetchFiles = useCallback(() => fetch(`http://192.168.0.182:54321/api/contract-files/${docid}?type=${documentType}`, {
        headers: {
            "Authorization": "Bearer " + props.token
        }
    }), [docid, props.token])
    return (
        <div className="visa-content-container" style={{ maxWidth: "1256px", margin: "auto", padding: "20px", paddingTop: "76px" }}>
            {
                modalState.visible &&
                <Modal
                    style={modalState.style}
                    changeModalState={closeModal}
                    childProps={modalState}
                >
                    {modalState.content}
                </Modal>
            }
            {
                paymentDetails.content.length !== 0
                    ? <>
                        <div>
                            <h1 style={{ fontSize: "24px", color: "gray", overflow: "hidden" }}>
                                <span style={{ float: "left" }}>
                                    {
                                        paymentDetails.content[0].user_result === undefined && paymentDetails.content[0].doc_result !== 0
                                            ? paymentDetails.content[0].doc_result === 1
                                                ? <FaCheck size="30" color="#0F9D58" />
                                                : <FaTimes size="30" color="#D93404" />
                                            : paymentDetails.content[0].user_result !== undefined && paymentDetails.content[0].user_result !== 0
                                                ? paymentDetails.content[0].user_result === 1
                                                    ? <FaCheck size="30" color="#0F9D58" />
                                                    : <FaTimes size="30" color="#D93404" />
                                                : paymentDetails.content[0].doc_result !== 0 && paymentDetails.content[0].user_result !== undefined
                                                    ? paymentDetails.content[0].doc_result === 1
                                                        ? <FaCheck size="30" color="#0F9D58" />
                                                        : <FaTimes size="30" color="#D93404" />
                                                    : ""
                                    }
                                </span>
                                {paymentDetails.content[0].number}
                                <span style={{ float: "right", cursor: "pointer", color: "rgb(255, 174, 0)" }}>
                                    <MdDetails size="30" onClick={showHistory} />
                                </span>
                                <span style={{ float: "right", cursor: "pointer", color: "rgb(255, 174, 0)", fontSize: "20px" }}>{paymentDetails.content[0].action_date_time}</span>
                            </h1>
                            <div style={{ maxWidth: "1024px", margin: "auto", marginBottom: "10px" }}>
                                <PaymentMaterials
                                    pid={docid}
                                    token={props.token}
                                />
                            </div>
                        </div>
                        <ContractFiles
                            fetchFiles={fetchFiles}
                        />
                        <RelatedDocs
                            docs={paymentDetails.content}
                            setRightPanel={setRightPanel}
                        />
                        <p>{paymentDetails.content[0].comment}</p>
                        <div style={{ margin: "6px 0px" }}>
                            {
                                props.referer === "procurement" && paymentDetails.active ?
                                    <div
                                        style={{ background: "#D93404", color: "white", padding: "6px", cursor: "pointer", borderRadius: "3px" }}
                                        onClick={cancel}
                                    >
                                        Razılaşmanı ləğv et
                                    </div>
                                    : paymentDetails.active &&
                                    <>
                                        <textarea ref={textareaRef} placeholder="Qeydlərinizi daxil edin.." style={{ width: "82%", minHeight: "100px" }} />
                                        <div className="accept-decline-container">
                                            <div
                                                style={{ background: "#D93404" }}
                                                onClick={() => acceptDeclince(-1)}
                                            >
                                                Etiraz et
                                            </div>
                                            <div
                                                style={{ background: "rgb(15, 157, 88)" }}
                                                onClick={() => acceptDeclince(1)}
                                            >
                                                Təsdiq et
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                        <Chat
                            loadMessages={fetchMessages}
                            documentid={docid}
                            documentType={documentType}
                            sendMessage={sendMessage}
                        />
                        {
                            rightPanel.visible &&
                            <RightInfoBar
                                setRightBarState={setRightPanel}
                            >
                                <AgreementGeneralInfo
                                    {...rightPanel}
                                    token={props.token}
                                    referer={props.referer}
                                />
                            </RightInfoBar>
                        }
                    </>
                    :
                    <EmptyContent />

            }
        </div>
    )
}

export default React.memo(PaymentContent, (prev, next) => {
    return prev.apiString === next.apiString;
})

const RelatedDocs = (props) => {
    const handleInfoClick = (doc) => {
        if (doc.related_doc_type === 1)
            props.setRightPanel(prev => {
                if (prev.id !== doc.related_doc_id || !prev.visible)
                    return {
                        visible: true,
                        id: doc.related_doc_id,
                        number: doc.related_doc_number,
                        result: doc.agreement_result,
                        action_date_time: doc.agreement_action_date_time
                    }
            })
    }
    return (
        <>
            <h1 style={{ float: "left", fontSize: "20px", color: "gray" }}>Əlaqəli sənədlər</h1>
            <div style={{ overflow: "hidden", clear: "left" }}>
                {
                    props.docs.map((doc, index) =>
                        <div
                            className="forwarded-person-card"
                            onClick={() => handleInfoClick(doc)}
                            style={{ minWidth: "50px", lineHeight: "28px", padding: "0px 6px", float: "left", cursor: "pointer" }}
                            key={index}
                        >
                            {doc.related_doc_number}
                        </div>
                    )
                }
            </div>
        </>
    )
}