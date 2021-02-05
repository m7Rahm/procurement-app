import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import AgreementVendors from './AgreementVendors'
import AgreementMaterials from '../../Tender/AgreementMaterials'
import EmptyContent from '../../Misc/EmptyContent'
import Chat from '../../Misc/Chat'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useLocation, useHistory } from 'react-router-dom'

const AgreementContent = (props) => {
    const location = useLocation();
    const history = useHistory();
    const locationState = location.state ? location.state : undefined;
    const referer = locationState ? locationState.orderState : null
    const docid = props.docid ? props.docid : locationState ? locationState.agreement.id : undefined;
    const number = props.number ? props.number : locationState ? locationState.agreement.number : null;
    const [docState, setDocState] = useState({ tranid: undefined, docid: docid });
    const tranid = props.tranid;
    useLayoutEffect(() => {
        let mounted = true;
        if (docid && mounted)
            fetch(`http://172.16.3.101:54321/api/agreement-content?${tranid ? `tranid=${tranid}&` : ''}docid=${docid}`, {
                headers: {
                    "Authorization": "Bearer " + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (mounted && respJ.length !== 0)
                        setDocState(prev => ({ ...prev,
                            agreementResult: respJ[0].agreement_result,
                            userResult: respJ[0].result,
                            comment: respJ[0].comment,
                            actionDate: respJ[0].action_date_time
                        }))
                })
                .catch(ex => console.log(ex));
        return () => mounted = false
    }, [tranid, docid, props.token]);
    const fetchMaterials = useCallback(() =>
        fetch(`http://172.16.3.101:54321/api/agreement-materials/${docid}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [docid, props.token]);
    useEffect(() => () => {
        if (history.action === "POP" && history.location.pathname === '/tender/orders')
            history.push('/tender/orders', referer)
    }, [history, referer])
    const fetchMessages = useCallback((from = 0) =>
        fetch(`http://172.16.3.101:54321/api/messages/${docid}?from=${from}&replyto=0&doctype=1`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [docid, props.token]);
    const sendMessage = useCallback((data) => {
        const apiData = JSON.stringify({ ...data, docType: 1 });
        return fetch(`http://172.16.3.101:54321/api/send-message`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json',
                'Content-Length': apiData.length
            },
            body: apiData
        })
    }, [props.token]);
    return (
        <div className="visa-content-container" style={{ padding: '88px 20px 20px 20px', maxWidth: '1256px', margin: 'auto' }}>
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
                        <AgreementMaterials
                            editable={false}
                            fetchFunction={fetchMaterials}
                            token={props.token}
                        />
                        <AgreementVendors
                            token={props.token}
                            active={docid}
                            tranid={tranid}
                            comment={docState.comment}
                            userResult={docState.userResult}
                            agreementResult={docState.agreementResult}
                            setDocState={setDocState}
                            referer={props.referer}
                            searchStateRef={props.searchStateRef}
                            setUpdateCards={props.setUpdateCards}
                        />
                        <Chat
                            loadMessages={fetchMessages}
                            documentid={docid}
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