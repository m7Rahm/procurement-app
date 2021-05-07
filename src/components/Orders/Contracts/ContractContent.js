import React, { useState, useEffect, useCallback, useRef, lazy, useContext } from 'react'
import { FaFilePdf, FaFileExcel, FaFileWord, FaCheck, FaTimes } from 'react-icons/fa';
import { AiFillFileUnknown } from 'react-icons/ai'
import Chat from '../../Misc/Chat'
import EmptyContent from '../../Misc/EmptyContent'
import { MdDetails } from 'react-icons/md'
import RightInfoBar from '../../Misc/RightInfoBar';
import AgreementGeneralInfo from './AgreementGeneralInfo'
import { WebSocketContext } from "../../../pages/SelectModule";
import useFetch from '../../../hooks/useFetch';

const AreYouSure = lazy(() => import("../../modal content/AreYouSure"))
const Modal = lazy(() => import('../../Misc/Modal'));
const Participants = lazy(() => import('../../Common/ParticipantsUniversal'));
const ContractContent = (props) => {
    const [contractDetails, setContractDetails] = useState({ content: [], active: false });
    const [rightPanel, setRightPanel] = useState({ visible: false, id: null });
    const [modalState, setModalState] = useState({ visible: false });
    const textareaRef = useRef(null);
    const docid = props.docid;
    const webSocket = useContext(WebSocketContext);
    const documentType = 2;
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const fetchParticipants = () => fetchGet(`http://192.168.0.182:54321/api/doc-participants?id=${docid}&doctype=${documentType}`);
    useEffect(() => {
        let mounted = true;
        if (props.apiString && mounted)
            fetchGet(props.apiString)
                .then(respJ => {
                    if (mounted && respJ.length !== 0)
                        setContractDetails({
                            content: respJ,
                            active: respJ[0].doc_result === 0 && (respJ[0].user_result === 0 || respJ[0].user_result === undefined)
                        })
                })
        return () => {
            mounted = false
        }
    }, [props.apiString, fetchGet]);
    const sendMessage = useCallback((data) => {
        const apiData = { ...data, docType: documentType };
        return fetchPost(`http://192.168.0.182:54321/api/send-message`, apiData)
    }, [fetchPost, documentType]);
    const fetchMessages = useCallback((from = 0) =>
        fetchGet(`http://192.168.0.182:54321/api/messages/${docid}?from=${from}&replyto=0&doctype=${documentType}`)
        , [docid, fetchGet, documentType]);
    const cancel = () => {
        const cancelContract = () => {
            fetchGet(`http://192.168.0.182:54321/api/cancel-doc/${docid}?type=${documentType}`)
                .then(respJ => {
                    if (respJ.length === 0)
                        setContractDetails(prev => ({ content: prev.content.map(detail => ({ ...detail, doc_result: -1 })), active: false }))
                })
                .catch(ex => console.log(ex))
        }
        setModalState({
            visible: true,
            style: {
                width: "600px",
                minWidth: "auto"
            },
            title: "Y/N",
            content: AreYouSure,
            text: "Razılaşmanı imtina etməyə",
            onCancel: closeModal,
            onAccept: cancelContract
        });
    }
    const acceptDeclince = (action) => {
        const data = {
            tranid: contractDetails.content[0].id,
            messageType: documentType,
            messageid: docid,
            action: action,
            comment: textareaRef.current.value
        }
        fetchPost('http://192.168.0.182:54321/api/accept-decline-doc', data)
            .then(respJ => {
                if (respJ.length !== 0) {
                    const message = {
                        message: "notification",
                        receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: receiver.next_id !== 0 ? "nC" : "sNot" })),
                        data: undefined
                    }
                    webSocket.send(JSON.stringify(message))
                }
                setContractDetails(prev => ({ active: false, content: prev.content.map(row => ({ ...row, user_result: action })) }))
                props.setInitData(prev => ({ ...prev }))
            })
            .catch(ex => console.log(ex))
    }
    const showHistory = () => {
        setModalState({ visible: true, fetchParticipants: fetchParticipants, content: Participants, title: "İştirakçılar" })
    }
    const closeModal = () => {
        setModalState({ visible: false })
    }
    const fetchFiles = useCallback(() => fetchGet(`http://192.168.0.182:54321/api/contract-files/${docid}?type=${documentType}`), [docid, fetchGet, documentType]);
    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto', padding: '20px', paddingTop: '76px' }}>
            {
                modalState.visible &&
                <Modal changeModalState={closeModal} title={modalState.title} childProps={modalState}>
                    {modalState.content}
                </Modal>
            }
            {
                contractDetails.content.length !== 0
                    ? <>
                        <div>
                            <h1 style={{ fontSize: '24px', color: 'gray' }}>
                                <span style={{ float: 'left' }}>
                                    {
                                        contractDetails.content[0].user_result === undefined && contractDetails.content[0].doc_result !== 0
                                            ? contractDetails.content[0].doc_result === 1
                                                ? <FaCheck size="30" color="#0F9D58" />
                                                : <FaTimes size="30" color="#D93404" />
                                            : contractDetails.content[0].user_result !== undefined && contractDetails.content[0].user_result !== 0
                                                ? contractDetails.content[0].user_result === 1
                                                    ? <FaCheck size="30" color="#0F9D58" />
                                                    : <FaTimes size="30" color="#D93404" />
                                                : contractDetails.content[0].doc_result !== 0 && contractDetails.content[0].user_result !== undefined
                                                    ? contractDetails.content[0].doc_result === 1
                                                        ? <FaCheck size="30" color="#0F9D58" />
                                                        : <FaTimes size="30" color="#D93404" />
                                                    : ''
                                    }
                                </span>
                                {contractDetails.content[0].number}
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)" }}>
                                    <MdDetails size="30" onClick={showHistory} />
                                </span>
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)", fontSize: '20px' }}>{contractDetails.content[0].action_date_time}</span>
                            </h1>

                        </div>
                        <ContractFiles fetchFiles={fetchFiles} />
                        <h1 style={{ fontSize: '24px', float: 'right' }}>
                            {contractDetails.content[0].vendor_name}
                            <br />
                            <span style={{ fontWeight: '700', color: 'slategray', fontSize: '18px' }}>{contractDetails.content[0].voen}</span>
                        </h1>
                        <RelatedDocs
                            docs={contractDetails.content}
                            setRightPanel={setRightPanel}
                        />
                        <p>{contractDetails.content[0].comment}</p>
                        <div style={{ margin: '6px 0px' }}>
                            {
                                props.referer === 'procurement' && contractDetails.active ?
                                    <div
                                        style={{ background: '#D93404', color: 'white', padding: '6px', cursor: 'pointer', borderRadius: '3px' }}
                                        onClick={cancel}
                                    >
                                        Razılaşmanı ləğv et
                                    </div>
                                    : contractDetails.active &&
                                    <>
                                        <textarea ref={textareaRef} placeholder="Qeydlərinizi daxil edin.." style={{ width: '82%', minHeight: '100px' }} />
                                        <div className="accept-decline-container">
                                            <div
                                                style={{ background: '#D93404' }}
                                                onClick={() => acceptDeclince(-1)}
                                            >
                                                Etiraz et
                                            </div>
                                            <div
                                                style={{ background: 'rgb(15, 157, 88)' }}
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

export default React.memo(ContractContent)

export const ContractFiles = React.memo((props) => {
    const [files, setFiles] = useState([]);
    const fetchFiles = props.fetchFiles;
    useEffect(() => {
        fetchFiles()
            .then(respJ => setFiles(respJ))
            .catch(ex => console.log(ex))
    }, [fetchFiles])
    return (
        <div className="uploaded-files">
            {
                files.map(file => {
                    const ext = file.ext;
                    const src = `http://192.168.0.182:54321/original/${file.name}`
                    switch (true) {
                        case /pdf/.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank">
                                        <FaFilePdf title={file.name} color="#F40F02" size="36" />
                                    </a>
                                </div>
                            )
                        case /doc./.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileWord title={file.name} color="#0078d7" size="36" />
                                    </a>
                                </div>
                            )
                        case /xls./.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileExcel title={file.name} color="#1D6F42" size="36" />
                                    </a>
                                </div>
                            )
                        default:
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank" download>
                                        <AiFillFileUnknown title={file.name} size="36" />
                                    </a>
                                </div>
                            )
                    }
                }
                )
            }
        </div>
    )
});
const RelatedDocs = (props) => {
    const handleInfoClick = (doc) => {
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
            <h1 style={{ float: 'left', fontSize: '20px', color: 'gray' }}>Əlaqəli sənədlər</h1>
            <div style={{ overflow: 'hidden', clear: 'left' }}>
                {
                    props.docs.map((doc, index) =>
                        <div
                            className="forwarded-person-card"
                            onClick={() => handleInfoClick(doc)}
                            style={{ minWidth: '50px', lineHeight: '28px', padding: '0px 6px', float: 'left', cursor: 'pointer' }}
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