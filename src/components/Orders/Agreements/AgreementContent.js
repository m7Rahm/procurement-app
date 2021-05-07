import React, { useCallback, useState, useLayoutEffect } from 'react'
import AgreementVendors from './AgreementVendors'
import AgreementMaterials from '../../Tender/AgreementMaterials'
import EmptyContent from '../../Misc/EmptyContent'
import Chat from '../../Misc/Chat'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import AgreementVendorFiles from './AgreementVendorFiles'
import useFetch from '../../../hooks/useFetch'
const AgreementContent = (props) => {
    const location = useLocation();
    const locationState = location.state ? location.state : undefined;
    const docid = props.docid ? props.docid : locationState ? locationState.tranid : undefined;
    const number = props.number ? props.number : locationState ? locationState.docNumber : null;
    const [docState, setDocState] = useState({ tranid: undefined, docid: docid });
    const documentType = 1;
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    useLayoutEffect(() => {
        let mounted = true;
        if (docid && mounted)
            fetchGet(`http://192.168.0.182:54321/api/agreement-content?docid=${docid}`)
                .then(respJ => {
                    if (mounted && respJ.length !== 0)
                        setDocState(prev => ({ ...prev,
                            agreementResult: respJ[0].agreement_result,
                            userResult: respJ[0].result,
                            comment: respJ[0].comment,
                            actionDate: respJ[0].action_date_time,
                            tranid: respJ[0].tran_id
                        }))
                })
                .catch(ex => console.log(ex));
        return () => mounted = false
    }, [docid, fetchGet]);
    const fetchMaterials = useCallback(() => fetchGet(`http://192.168.0.182:54321/api/agreement-materials/${docid}`), [docid, fetchGet]);
    const fetchMessages = useCallback((from = 0) => fetchGet(`http://192.168.0.182:54321/api/messages/${docid}?from=${from}&replyto=0&doctype=${documentType}`), [docid, fetchGet, documentType]);
    const sendMessage = useCallback((data) => {
        const apiData = { ...data, docType: documentType };
        return fetchPost(`http://192.168.0.182:54321/api/send-message`, apiData)
    }, [fetchPost, documentType]);
    return (
        <div className="visa-content-container" style={{ padding: '68px 20px 20px 20px', maxWidth: '1256px', margin: 'auto' }}>
            {
                docid ?
                    <>
                        <h1 style={{ fontSize: '24px', color: 'gray' }}>{number}</h1>
                        {
                            (docState.userResult === undefined) && docState.agreementResult !== 0 &&
                            <div>
                                {
                                    docState.agreementResult === 1
                                        ? <FaCheck style={{ float: 'left' }} size="50" color="#0F9D58" />
                                        : <FaTimes style={{ float: 'left' }} size="50" color="#D93404" />
                                }
                                <h1 style={{ float: 'right', fontSize: '24px' }}>{docState.actionDate}</h1>
                            </div>
                        }
                        {
                            docState.userResult !== undefined && docState.userResult !== 0 &&
                            <div>
                                {
                                    docState.userResult === 1
                                        ? <FaCheck style={{ float: 'left' }} size="50" color="#0F9D58" />
                                        : <FaTimes style={{ float: 'left' }} size="50" color="#D93404" />
                                }
                                <h1 style={{ float: 'right', fontSize: '24px' }}>{docState.actionDate}</h1>
                            </div>
                        }
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                            <AgreementMaterials
                                editable={false}
                                fetchFunction={fetchMaterials}
                            />
                            <AgreementVendorFiles
                                agreementid={docid}
                                vendorid={0}
                            />
                        </div>
                        <AgreementVendors
                            active={docid}
                            tranid={docState.tranid}
                            comment={docState.comment}
                            userResult={docState.userResult}
                            agreementResult={docState.agreementResult}
                            setDocState={setDocState}
                            referer={props.referer}
                            setInitData={props.setInitData}
                        />
                        <Chat
                            loadMessages={fetchMessages}
                            documentid={docid}
                            documentType={documentType}
                            tranid={docState.tranid}
                            sendMessage={sendMessage}
                        />
                    </>
                    :
                    <EmptyContent />
            }
        </div>

    )
}
export default React.memo(AgreementContent)