import React, { useState, useEffect, useCallback, useRef, lazy, useContext } from "react"
import { FaCheck,
    // FaFilePdf,
    FaTimes } from "react-icons/fa";
import Chat from "../../Misc/Chat"
import EmptyContent from "../../Misc/EmptyContent"
import { MdDetails } from "react-icons/md"
import { ContractFiles } from "./ContractContent"
import RightInfoBar from "../../Misc/RightInfoBar";
import AgreementGeneralInfo from "./AgreementGeneralInfo"
import PaymentMaterials from "./PaymentMaterials"
import { WebSocketContext } from "../../../pages/SelectModule";
import useFetch from "../../../hooks/useFetch";
// import { Link } from "react-router-dom";

const Modal = lazy(() => import("../../Misc/Modal"));
const AreYouSure = lazy(() => import("../../modal content/AreYouSure"))
const Participants = lazy(() => import("../../Common/ParticipantsUniversal"));
const PaymentContent = (props) => {
    const [paymentDetails, setPaymentDetails] = useState({ content: [], active: false });
    const [rightPanel, setRightPanel] = useState({ visible: false, id: null });
    const [modalState, setModalState] = useState({ visible: false, title: "Ödəniş Razılaşması № " })
    const textareaRef = useRef(null);
    const materialsRef = useRef(null);
    const webSocket = useContext(WebSocketContext);
    const docid = props.docid;
    const documentType = 3;
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const fetchParticipants = () => fetchGet(`http://192.168.0.182:54321/api/doc-participants?id=${docid}&doctype=${documentType}`)
    useEffect(() => {
        let mounted = true;
        if (props.apiString && mounted)
            fetchGet(props.apiString)
                .then(respJ => {
                    if (mounted && respJ.length)
                        setPaymentDetails({
                            content: respJ,
                            active: respJ[0].doc_result === 0 && (respJ[0].user_result === 0 || respJ[0].user_result === undefined)
                        })
                })
        return () => {
            mounted = false
        };
    }, [props.apiString, fetchGet]);
    const sendMessage = useCallback((data) => {
        const apiData = { ...data, docType: documentType };
        return fetchPost(`http://192.168.0.182:54321/api/send-message`, apiData)
    }, [fetchPost, documentType]);
    const fetchMessages = useCallback((from = 0) =>
        fetchGet(`http://192.168.0.182:54321/api/messages/${docid}?from=${from}&replyto=0&doctype=${documentType}`)
        , [docid, fetchGet, documentType]);
    const cancel = () => {
        const cancelPayment = () => {
            fetchGet(`http://192.168.0.182:54321/api/cancel-doc/${docid}?type=3`)
                .then(respJ => {
                    if (respJ.length === 0) {
                        setPaymentDetails(prev => ({ content: prev.content.map(detail => ({ ...detail, doc_result: -1 })), active: false }));
                        closeModal();
                        props.setInitData(prev => ({ ...prev }))
                    }
                })
                .catch(ex => console.log(ex))
        }
        setModalState(prev => ({
            ...prev,
            visible: true,
            style: {
                width: "600px",
                minWidth: "auto"
            },
            number: paymentDetails.content[0].number,
            content: AreYouSure,
            text: "Razılaşmanı imtina etməyə",
            onCancel: closeModal,
            onAccept: cancelPayment
        }))
    }
    const acceptDeclince = (action) => {
        const data = {
            tranid: paymentDetails.content[0].id,
            messageType: documentType,
            messageid: docid,
            action: action,
            comment: textareaRef.current.value
        }
        fetchPost("http://192.168.0.182:54321/api/accept-decline-doc", data)
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
        setModalState(prev => ({
            ...prev,
            visible: true,
            number: paymentDetails.content[0].number,
            fetchParticipants: fetchParticipants,
            content: Participants
        }))
    }
    const closeModal = () => {
        setModalState(prev => ({ ...prev, visible: false }))
    }
    // const exporToPdf = () => {
        
    // }
    const fetchFiles = useCallback(() => fetchGet(`http://192.168.0.182:54321/api/contract-files/${docid}?type=${documentType}`), [docid, fetchGet])
    return (
        <div className="visa-content-container" style={{ maxWidth: "1256px", margin: "auto", padding: "20px", paddingTop: "76px" }}>
            {
                modalState.visible &&
                <Modal
                    title={modalState.title}
                    number={modalState.number}
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
                        <div style={{ overflowY: "visible" }}>
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
                                {/* <span title="PDF çap et" style={{ float: "right", cursor: "pointer", color: "rgb(255, 0, 0)" }}>
                                    <Link to={{
                                        state: {
                                            materials: materialsRef,
                                            number: paymentDetails.content[0].number,
                                            docid: docid,
                                            docType: documentType
                                        },
                                        pathname: "/exports"
                                    }}>
                                        <FaFilePdf size="30" onClick={exporToPdf} />
                                    </Link>
                                </span> */}
                                <span style={{ float: "right", cursor: "pointer", color: "rgb(255, 174, 0)", fontSize: "20px" }}>{paymentDetails.content[0].action_date_time}</span>
                            </h1>
                            <div style={{ maxWidth: "1024px", margin: "auto", marginBottom: "10px" }}>
                                <PaymentMaterials
                                    pid={docid}
                                    materialsRef={materialsRef}
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

export default React.memo(PaymentContent)

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