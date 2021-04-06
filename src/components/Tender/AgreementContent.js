import React, { lazy, useEffect, useState } from 'react'
import { AiFillCheckCircle } from 'react-icons/ai'
import { FaInfoCircle } from 'react-icons/fa'
import OperationResult from '../Misc/OperationResult'
import EmptyContent from '../Misc/EmptyContent'
import { useLocation } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
const RightInfoBar = lazy(() => import('../Misc/RightInfoBar'))
const AgreementsList = lazy(() => import('../Misc/AgreementsList'));
const AgreementContent = (props) => {
    const [orderContent, setOrderContent] = useState([]);
    const location = useLocation();
    const locationState = location.state ? location.state : undefined
    const [rightBarState, setRightBarState] = useState({ visible: false, id: null });
    const [operationResult, setOperationResult] = useState({
        visible: false,
        desc: '',
        backgroundColor: 'white',
        iconColor: 'rgb(15, 157, 88)',
        icon: AiFillCheckCircle
    });
    const active = props.active ? props.active : locationState ? locationState.active : null
    const fetchGet = useFetch("GET")
    useEffect(() => {
        if (active) {
            fetchGet(`http://192.168.0.182:54321/api/get-tender-order-content/${active}`)
                .then(respJ => setOrderContent(respJ))
                .catch(ex => console.log(ex))
        }
    }, [active, fetchGet]);
    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto', paddingTop: '76px' }}>
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                    iconColor={operationResult.iconColor}
                    icon={operationResult.icon}
                />
            }
            {
                active ?
                    <>
                        <h1>{props.ordNumb}</h1>
                        <h1>{props.basedOn}</h1>
                        <h1>{props.departmentName}</h1>
                        <ul className="new-order-table order-table-protex">
                            <li>
                                <div>#</div>
                                <div style={{ textAlign: 'left' }}>Material</div>
                                <div style={{ maxWidth: '140px' }}>Say</div>
                                <div>Əlavə məlumat</div>
                                <div></div>
                                <div style={{ width: '100px' }}>Status</div>
                            </li>
                            {
                                orderContent.map((material, index) =>
                                    <AgreementMaterial
                                        key={material.id}
                                        index={index}
                                        material={material}
                                        setRightBarState={setRightBarState}
                                        setInitData={props.setInitData}
                                        setOperationResult={setOperationResult}
                                    />
                                )
                            }
                        </ul>
                        {
                            rightBarState.visible &&
                            <RightInfoBar setRightBarState={setRightBarState}>
                                <AgreementsList
                                    id={rightBarState.id}
                                    active={active}
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
export default React.memo(AgreementContent)

const getMaterialState = (result) => {
    if (result === 30)
        return 'Razılaşmada'
    else if (result === 31)
        return 'Razılaşdırılıb'
    else
        return ''
}
const AgreementMaterial = (props) => {
    const [materialState, setMaterialState] = useState(props.material);
    const stateText = getMaterialState(materialState.result);
    const fetchPost = useFetch("POST")
    const handleInfoClick = () => {
        props.setRightBarState({ visible: true, id: materialState.id })
    }
    const sendToAgreement = () => {
        const data = {
            id: materialState.id
        };
        fetchPost('http://192.168.0.182:54321/api/send-to-staging-area', data)
            .then(respJ => {
                if (!respJ.length || !respJ[0].error) {
                    setMaterialState(prev => ({ ...prev, result: 30 }))
                    props.setOperationResult(prev => ({ ...prev, ...{ visible: true, desc: 'Əməliyyat uğurla tamamlandı' } }));
                    if (respJ.length !== 0 && respJ[0].order_status)
                        props.setInitData(prev => ({ ...prev }))
                }
                else if (respJ.length > 2 || respJ[0].error)
                    props.setOperationResult({ visible: true, desc: respJ[0].error })
            })
            .catch(ex => console.log(ex))
    }
    return (
        <li>
            <div>{props.index + 1}</div>
            <div>{materialState.title}</div>
            <div style={{ maxWidth: '140px' }}>{materialState.amount}</div>
            <div>{materialState.comment}</div>
            <div>
                {
                    materialState.result !== 31 &&
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }} >
                        <div
                            style={{ backgroundColor: '#f8942a', color: 'white', padding: '10px 20px', cursor: 'pointer' }}
                            onClick={sendToAgreement}
                        >
                            Razılaşmaya
                        </div>
                    </div>
                }
            </div>
            <div style={{ width: '100px' }}>
                {stateText}
                <span style={{ padding: '6px', cursor: 'pointer' }}>
                    <FaInfoCircle size="14" color="royalblue" onClick={handleInfoClick} />
                </span>
            </div>
        </li>
    )
}