import React, { useState, useEffect, useCallback, useRef, lazy } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa';
import Chat from '../../Misc/Chat'
import EmptyContent from '../../Misc/EmptyContent'
import { MdDetails } from 'react-icons/md'
import { ContractFiles } from './ContractContent'
import RightInfoBar from '../../Misc/RightInfoBar';
import AgreementGeneralInfo from './AgreementGeneralInfo'
const Modal = lazy(() => import('../../Misc/Modal'));
const Participants = lazy(() => import('../../Common/ParticipantsUniversal'));
const PaymentContent = (props) => {
    const [contractDetails, setContractDetails] = useState([]);
    const [rightPanel, setRightPanel] = useState({ visible: false, id: null });
    const [modalState, setModalState] = useState({ visible: false })
    const textareaRef = useRef(null);
    const agreementResult = props.current.agreementResult;
    const active = agreementResult === 0 && props.current.userResult === 0;
    const docid = props.current.active
    const actionDate = props.current.action_date_time;
    const fetchParticipants = () => fetch(`http://192.168.0.182:54321/api/doc-participants?id=${docid}&doctype=3`, {
        headers: {
            'Authorization': 'Bearer ' + props.token
        }
    })
    useEffect(() => {
        if (props.apiString)
            fetch(props.apiString, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => setContractDetails(respJ))
    }, [props.apiString, props.token]);
    const sendMessage = useCallback((data) => {
        const apiData = JSON.stringify({ ...data, docType: 3 });
        return fetch(`http://192.168.0.182:54321/api/send-message`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json',
                'Content-Length': apiData.length
            },
            body: apiData
        })
    }
        , [props.token]);
    const fetchMessages = useCallback(() =>
        fetch(`http://192.168.0.182:54321/api/messages/${docid}?from=0&replyto=0&doctype=2`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [docid, props.token]);
    const cancel = () => {

    }
    const acceptDeclince = (action) => {
        const data = JSON.stringify({
            tranid: props.current.tranid,
            messageType: 3,
            messageid: docid,
            action: action,
            comment: textareaRef.current.value
        })
        fetch('http://192.168.0.182:54321/api/accept-decline-doc', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length === 0) {
                    props.setActive(prev => ({ ...prev, userResult: action }))
                }
            })
            .catch(ex => console.log(ex))
    }
    const showHistory = () => {
        setModalState({ visible: true, fetchParticipants: fetchParticipants })
    }
    const closeModal = () => {
        setModalState({ visible: false })
    }
    const fetchFiles = useCallback(() => fetch(`http://192.168.0.182:54321/api/contract-files/${docid}?type=3`, {
        headers: {
            'Authorization': 'Bearer ' + props.token
        }
    }), [docid, props.token])
    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto', padding: '20px', paddingTop: '76px' }}>
            {
                modalState.visible &&
                <Modal changeModalState={closeModal} childProps={modalState}>
                    {Participants}
                </Modal>
            }
            {
                contractDetails.length !== 0
                    ? <>
                        <div>
                            <h1 style={{ fontSize: '24px', color: 'gray' }}>
                                <span style={{ float: 'left' }}>
                                    {
                                        props.current.userResult === undefined && agreementResult !== 0
                                            ? agreementResult === 1
                                                ? <FaCheck size="30" color="#0F9D58" />
                                                : <FaTimes size="30" color="#D93404" />
                                            : props.current.userResult !== undefined && props.current.userResult !== 0
                                                ? props.current.userResult === 1
                                                    ? <FaCheck size="30" color="#0F9D58" />
                                                    : <FaTimes size="30" color="#D93404" />
                                                : ''
                                    }
                                </span>
                                {contractDetails[0].number}
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)" }}>
                                    <MdDetails size="30" onClick={showHistory} />
                                </span>
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)", fontSize: '20px' }}>{actionDate}</span>
                            </h1>

                        </div>
                        <ContractFiles
                            fetchFiles={fetchFiles}
                        />
                        <RelatedDocs
                            docs={contractDetails}
                            setRightPanel={setRightPanel}
                        />
                        <p>{contractDetails[0].comment}</p>
                        <div style={{ margin: '6px 0px' }}>
                            {
                                props.referer === 'procurement' && active ?
                                    <div
                                        style={{ background: '#D93404', color: 'white', padding: '6px', cursor: 'pointer', borderRadius: '3px' }}
                                        onClick={cancel}
                                    >
                                        Razılaşmanı ləğv et
                                    </div>
                                    : active &&
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