import React, { useCallback, useEffect } from 'react'
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
    const active = props.current.active ? props.current.active : locationState ? locationState.agreement.id : undefined;
    const agreementResult = props.current.agreementResult ? props.current.agreementResult : locationState ? locationState.agreement.result : undefined;
    const actionDate = props.current.actionDate ? props.current.actionDate : locationState ? locationState.agreement.action_date_time : null;
    const number = props.current.number ? props.current.number : locationState ? locationState.agreement.number : null;
    const fetchMaterials = useCallback(() =>
        fetch(`http://172.16.3.101:54321/api/agreement-materials/${active}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [active, props.token]);
    useEffect(() => () => {
        if (history.action === "POP" && history.location.pathname === '/tender/orders')
            history.push('/tender/orders', referer)
    }, [history, referer])
    const fetchMessages = useCallback(() =>
        fetch(`http://172.16.3.101:54321/api/messages/${active}?from=0&replyto=0&doctype=1`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [active, props.token]);
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
    }
        , [props.token]);
    return (
        <div className="visa-content-container" style={{ padding: '88px 20px', maxWidth: '1256px', margin: 'auto' }}>
            {
                active ?
                    <>
                        <h1 style={{ fontSize: '24px', color: 'gray' }}>{number}</h1>
                        {
                            (props.current.userResult === undefined) && agreementResult !== 0 &&
                            <div>
                                {
                                    agreementResult === 1
                                        ? <FaCheck style={{ float: 'left' }} size="50" color="#0F9D58" />
                                        : <FaTimes style={{ float: 'left' }} size="50" color="#D93404" />
                                }
                                <h1 style={{ float: 'right', fontSize: '24px' }}>{actionDate}</h1>
                            </div>
                        }
                        {
                            props.current.userResult !== undefined &&
                            <div>
                                {
                                    props.current.userResult === 1
                                        ? <FaCheck style={{ float: 'left' }} size="50" color="#0F9D58" />
                                        : <FaTimes style={{ float: 'left' }} size="50" color="#D93404" />
                                }
                                <h1 style={{ float: 'right', fontSize: '24px' }}>{actionDate}</h1>
                            </div>
                        }
                        <AgreementMaterials
                            editable={false}
                            fetchFunction={fetchMaterials}
                            token={props.token}
                            active={active}
                        />
                        <AgreementVendors
                            token={props.token}
                            active={active}
                            tranid={props.current.tranid}
                            userResult={props.current.userResult}
                            agreementResult={agreementResult}
                            setActive={props.setActive}
                            referer={props.referer}
                        />
                        <Chat
                            loadMessages={fetchMessages}
                            documentid={active}
                            sendMessage={sendMessage}
                        />
                    </>
                    :
                    <EmptyContent />
            }
        </div>

    )
}
export default AgreementContent