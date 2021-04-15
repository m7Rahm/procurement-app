import React, { useContext, useState } from 'react'
import { TokenContext } from '../../../App'
import useFetch from '../../../hooks/useFetch';
import ForwardDocLayout from '../../Misc/ForwardDocLayout';
import OperationResult from '../../Misc/OperationResult'
const AcceptDecline = React.lazy(() => import('../../modal content/AcceptDecline'))

const VisaContentFooter = (props) => {
    const { handleEditClick, current, canProceed, updateContent, forwardDoc } = props;
    const tokenContext = useContext(TokenContext);
    const userData = tokenContext[0].userData;
    const canApprove = userData.previliges.find(prev => prev === 'Sifarişi təsdiq etmək');
    const canDecline = userData.previliges.find(prev => prev === 'Sifarişə etiraz etmək');
    const canReturn = userData.previliges.find(prev => prev === 'Sifarişi redaktəyə qaytarmaq');
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const fetchPost = useFetch("POST");
    const setIsModalOpen = (order, receivers, originid) => {
        updateContent({
            id: order.id,
            act_date_time: order.act_date_time,
            result: order.result,
            comment: order.comment
        }, receivers, originid)
    }
    const handleForwardOrder = (receivers, comment) => {
        const data = {
            receivers: receivers.map(receiver => [receiver.id]),
            comment: comment
        }
        fetchPost(`http://192.168.0.182:54321/api/forward-order/${current.order_id}`, data)
            .then(respJ => {
                if (respJ.length === 0)
                    forwardDoc(receivers)
                else
                    setOperationResult({ visible: true, desc: 'Xəta baş verdi' })
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
            setOperationResult({ visible: true, desc: "Qiymət seçimi tamamlanmamışdır" })
    }
    return (
        current.result === 0 && current.can_influence
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