import React, { useState, useEffect, useCallback, useRef, lazy } from 'react'
import { FaFilePdf, FaFileExcel, FaFileWord, FaCheck, FaTimes } from 'react-icons/fa';
import { AiFillFileUnknown } from 'react-icons/ai'
import Chat from '../../Misc/Chat'
import EmptyContent from '../../Misc/EmptyContent'
import { MdDetails } from 'react-icons/md'
import RightInfoBar from '../../Misc/RightInfoBar';
import AgreementGeneralInfo from './AgreementGeneralInfo'
const Modal = lazy(() => import('../../Misc/Modal'));
const Participants = lazy(() => import('../../Common/ParticipantsUniversal'));
const ContractContent = (props) => {
    const [contractDetails, setContractDetails] = useState({ content: [], active: false });
    const [rightPanel, setRightPanel] = useState({ visible: false, id: null });
    const [modalState, setModalState] = useState({ visible: false });
    const textareaRef = useRef(null);
    const docid = props.docid;
    const fetchParticipants = () => fetch(`http://192.168.0.182:54321/api/doc-participants?id=${docid}&doctype=2`, {
        headers: {
            'Authorization': 'Bearer ' + props.token
        }
    });
    useEffect(() => {
        let mounted = true;
        if (props.apiString && mounted)
            fetch(props.apiString, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (mounted)
                        setContractDetails({
                            content: respJ,
                            active: respJ[0].doc_result === 0 && (respJ[0].user_result === 0 || respJ[0].user_result === undefined)
                        })
                })
        return () => mounted = false
    }, [props.apiString, props.token]);
    const sendMessage = useCallback((data) => {
        const apiData = JSON.stringify({ ...data, docType: 2 });
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
            tranid: props.tranid,
            messageType: 2,
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
                    setContractDetails(prev => ({active: false, content: prev.content.map(row => ({ ...row, user_result: action }))}))
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
    const fetchFiles = useCallback(() => fetch(`http://192.168.0.182:54321/api/contract-files/${docid}?type=2`, {
        headers: {
            'Authorization': 'Bearer ' + props.token
        }
    }), [docid, props.token]);
    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto', padding: '20px', paddingTop: '76px' }}>
            {
                modalState.visible &&
                <Modal changeModalState={closeModal} childProps={modalState}>
                    {Participants}
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
                                {props.number}
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)" }}>
                                    <MdDetails size="30" onClick={showHistory} />
                                </span>
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)", fontSize: '20px' }}>{contractDetails.content[0].action_date_time}</span>
                            </h1>

                        </div>
                        <ContractFiles
                            fetchFiles={fetchFiles}
                        />
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

export default React.memo(ContractContent)

export const ContractFiles = React.memo((props) => {
    const [files, setFiles] = useState([]);
    const fetchFiles = props.fetchFiles;
    useEffect(() => {
        fetchFiles()
            .then(resp => resp.json())
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
                                    <a href={src} rel="noopener noreferrer" target="_blank">
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