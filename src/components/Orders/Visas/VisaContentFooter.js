import React, { useContext, useState } from 'react'
import { TokenContext } from '../../../App'
import ForwardDocLayout from '../../Misc/ForwardDocLayout';
import OperationResult from '../../Misc/OperationResult'
const AcceptDecline = React.lazy(() => import('../../modal content/AcceptDecline'))

const VisaContentFooter = (props) => {
    const { handleEditClick, current, canProceed, updateContent } = props;
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const userData = tokenContext[0].userData;
    const canApprove = userData.previliges.find(prev => prev === 'Sifarişi təsdiq etmək');
    const canDecline = userData.previliges.find(prev => prev === 'Sifarişə etiraz etmək');
    const canReturn = userData.previliges.find(prev => prev === 'Sifarişi redaktəyə qaytarmaq');
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const setIsModalOpen = (order, receivers, originid) => {
        updateContent({
            id: order.id,
            act_date_time: order.act_date_time,
            result: order.result,
            comment: order.comment
        }, receivers, originid)
    }
    const handleForwardOrder = (receivers, comment) => {
        const data = JSON.stringify({
            receivers: receivers.map(receiver => [receiver.id]),
            comment: comment
        })
        fetch(`http://192.168.0.182:54321/api/forward-order/${current.id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authorization': 'Bearer ' + token
                },
                body: data
            })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].operation_result === 'success')
                    setIsModalOpen([respJ[0].head_id], respJ[0])
                else if (respJ[0].error === 'Logical Error')
                    setOperationResult({ visible: true, desc: 'Operation not finished' })
            })
            .catch(ex => console.log(ex))
    }
    const hoc = (Component, compoProps) => () => {
        if (!Object.values(canProceed.current).includes(false))
            handleEditClick((props) =>
                <Component
                    {...compoProps}
                    {...props}
                />)
        else
            setOperationResult({ visible: true, desc: 'Operation not finished' })
    }
    return (
        current.result === 0 && current.order_result === 0
            ? <>
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                    />
                }
                <div className="accept-decline-container">
                    {
                        canDecline &&
                        <div
                            onClick={
                                hoc(AcceptDecline,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        action: -1,
                                        setOperationResult: setOperationResult,
                                        token: token,
                                        backgroundColor: '#D93404'
                                    }
                                )
                            }
                            style={{ background: '#D93404' }}
                        >
                            Etiraz
                        </div>
                    }
                    {
                        canApprove &&
                        <div
                            onClick={
                                hoc(AcceptDecline,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        setOperationResult: setOperationResult,
                                        action: 1,
                                        token: token,
                                        backgroundColor: 'rgb(15, 157, 88)'
                                    }
                                )
                            }
                            style={{ background: 'rgb(15, 157, 88)' }}
                        >
                            Təsdiq
                        </div>
                    }
                    {
                        canReturn && current.forward_type !== 4 &&
                        <div
                            onClick={
                                hoc(AcceptDecline,
                                    {
                                        handleModalClose: setIsModalOpen,
                                        tranid: current.id,
                                        setOperationResult: setOperationResult,
                                        action: 2,
                                        token: token,
                                        backgroundColor: '#F4B400'
                                    }
                                )
                            }
                            style={{ background: '#F4B400' }}
                        >
                            Redaktəyə qaytar
                        </div>
                    }
                    {
                        current.forward_type === 3 &&
                        <div
                            onClick={
                                hoc(ForwardDocLayout,
                                    {
                                        handleSendClick: handleForwardOrder,
                                        token: token,
                                    }
                                )
                            }
                            style={{ background: '#00a3e4' }}
                        >
                            Əlavə struktur cəlb et
                        </div>
                    }
                </div>
            </>
            :
            <>
            </>
    )
}
export default VisaContentFooter