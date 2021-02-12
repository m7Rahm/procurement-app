import React, { useEffect, useState, useRef } from 'react'
import UserAgreementVendorRow from './UserAgreementVendorRow'
import AgreementVendorInfo from '../../modal content/AgreementVendorInfo'
import OperationResult from '../../Misc/OperationResult'
const Modal = React.lazy(() => import('../../Misc/Modal'));

const AgreementVendors = (props) => {
    const [agreementVendors, setAgreementVendors] = useState([]);
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '', icon: null })
    const textAreaRef = useRef(null);
    const active = props.agreementResult === 0 && props.userResult === 0;
    useEffect(() => {
        if (props.active) {
            fetch(`http://192.168.0.182:54321/api/agreement-vendors/${props.active}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => setAgreementVendors(respJ))
                .catch(ex => console.log(ex))
        }
    }, [props.active, props.token]);
    const handleDetailsClick = (messageid, vendorid) => {
        setModalState({ visible: true, messageid: messageid, vendorid: vendorid, content: AgreementVendorInfo })
    }
    const closeModal = () => setModalState({ visible: false });
    const declineAgreement = () => {
        const handleDecline = (text) => {
            const data = JSON.stringify({
                agreementid: props.active,
                comment: text,
                action: -1,
                tranid: props.tranid
            })
            fetch('http://192.168.0.182:54321/api/accept-decline-agreement', {
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
                        closeModal();
                        props.setDocState(prev => ({ ...prev, userResult: -1, actionDate: 'Just now' }));
                        if (props.searchStateRef.current.result === 0)
                            props.setUpdateCards(prev => !prev)
                    }
                })
                .catch(ex => console.log(ex))
        }
        setModalState({ visible: true, handleSend: handleDecline, content: DeclineReason })
    }
    const confirmSelections = () => {
        const selected = agreementVendors.filter(vendor => vendor.result === 1).map(vendor => [vendor.id, vendor.review]);
        if (selected.length !== 0) {
            const data = JSON.stringify({
                vendors: selected,
                agreementid: props.active,
                comment: textAreaRef.current.value,
                action: 1,
                tranid: props.tranid
            });
            fetch('http://192.168.0.182:54321/api/accept-decline-agreement', {
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
                        props.setDocState(prev => ({ ...prev, userResult: 1, actionDate: 'Just now' }))
                        if (props.searchStateRef.current.result === 0)
                            props.setUpdateCards(prev => !prev)
                    }
                })
                .catch(ex => console.log(ex))
        }
        else
            setOperationResult({ visible: true, desc: 'Seçim etməmisiniz', backgroundColor: 'white' })
    }
    const cancelAgreement = () => {

        const handleCnacel = (comment) => {
            const data = JSON.stringify({
                agreementid: '',
                comment: comment
            })
            fetch('http://192.168.0.182:54321/api/cancel-agreement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authorization': 'Bearer ' + props.token
                },
                body: data
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length === 0) {
                        closeModal();
                        props.setDocState(prev => ({ ...prev, agreementResult: -1, actionDate: 'Just now' }))
                    }
                })
                .catch(ex => console.log(ex))
        }
        setModalState({ visible: true, handleSend: handleCnacel, content: DeclineReason })
    }
    return (
        <>
            <>
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                        backgroundColor={operationResult.backgroundColor}
                    />
                }
                <ul className="new-order-table order-table-protex">
                    <li>
                        <div>#</div>
                        <div>Ad</div>
                        <div>VÖEN</div>
                        <div>Xid. sahəsi</div>
                        <div>Qeyd</div>
                        {
                            props.referer !== 'procurement' &&
                            <div>Rəy</div>
                        }
                        <div></div>
                        {
                            props.referer !== 'procurement' &&
                            <div></div>
                        }
                    </li>
                    {
                        agreementVendors.map((vendor, index) =>
                            <UserAgreementVendorRow
                                index={index}
                                key={vendor.id}
                                userResult={props.userResult}
                                agreementResult={props.agreementResult}
                                vendor={vendor}
                                referer={props.referer}
                                agreementid={props.active}
                                handleDetailsClick={handleDetailsClick}
                                setModalState={props.setModalState}
                                setAgreementVendors={setAgreementVendors}
                            />
                        )
                    }
                </ul>
                {
                    modalState.visible &&
                    <Modal
                        childProps={modalState}
                        changeModalState={closeModal}
                    >
                        {modalState.content}
                    </Modal>
                }
                <textarea
                    style={{ margin: '30px', width: '61%', height: '50px' }}
                    placeholder="Əlavə qeydlər..."
                    defaultValue={props.comment || ''}
                    disabled={true}
                    ref={textAreaRef}
                />
                {
                    props.referer === 'procurement' && active ?
                        <div
                            style={{ background: '#D93404', color: 'white', padding: '6px', cursor: 'pointer', maxWidth: '200px', borderRadius: '3px' }}
                            onClick={cancelAgreement}
                        >
                            Razılaşmanı ləğv et
                        </div>
                        : active &&
                        <div className="accept-decline-container">
                            <div
                                style={{ background: '#D93404' }}
                                onClick={declineAgreement}
                            >
                                Etiraz
                            </div>
                            <div
                                style={{ background: 'rgb(15, 157, 88)' }}
                                onClick={confirmSelections}
                            >
                                Seçimləri təsdiqlə
                            </div>
                        </div>
                }
            </>
        </>
    )
}
export default AgreementVendors

const DeclineReason = (props) => {
    const reasonRef = useRef(null);
    const handleSend = () => {
        props.handleSend(reasonRef.current.value);
    }
    return (
        <div style={{ overflow: 'hidden' }}>
            <textarea placeholder="Etirazın səbəbini bildirin.." ref={reasonRef} style={{ width: '90%', clear: 'both', height: '70px' }} />
            <div className="create-agreement-button" onClick={handleSend}>Göndər</div>
        </div>
    )
}