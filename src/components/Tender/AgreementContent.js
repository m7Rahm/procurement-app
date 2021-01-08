import React, { useEffect, useState, useRef } from 'react'
import {
    MdDone
} from 'react-icons/md'
import {
    AiFillCheckCircle
} from 'react-icons/ai'
import OperationResult from '../Misc/OperationResult'
import EmptyContent from '../Misc/EmptyContent'
const AgreementContent = (props) => {
    const [orderContent, setOrderContent] = useState([]);
    const [operationResult, setOperationResult] = useState({
        visible: false,
        desc: '',
        backgroundColor: 'white',
        iconColor: 'rgb(15, 157, 88)',
        icon: AiFillCheckCircle
    })
    useEffect(() => {
        if (props.active) {
            fetch(`http://172.16.3.101:54321/api/get-tender-order-content/${props.active}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => setOrderContent(respJ))
                .catch(ex => console.log(ex))
        }
    }, [props.active, props.token])
    return (
        <div className="visa-content-container">
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
                props.active ?
                    <ul className="new-order-table order-table-protex">
                        <li>
                            <div>#</div>
                            <div style={{ textAlign: 'left' }}>Material</div>
                            <div style={{ maxWidth: '140px' }}>Say</div>
                            <div>Vendor</div>
                            <div>Müqavilə</div>
                            <div></div>
                            <div>Status</div>
                        </li>
                        {
                            orderContent.map((material, index) =>
                                <AgreementMaterial
                                    key={material.id}
                                    index={index}
                                    material={material}
                                    token={props.token}
                                    setOperationResult={setOperationResult}
                                    vendors={props.expressVendors}
                                />
                            )
                        }
                    </ul>
                    :
                    <EmptyContent/>
            }
        </div>
    )
}
export default AgreementContent

const getMaterialState = (result) => {
    if (result === 10)
        return 'Razılaşmada'
    else if (result === 11)
        return 'Ödənişə yönəldilib'
    else
        return ''
}
const AgreementMaterial = (props) => {
    const [materialState, setMaterialState] = useState(props.material);
    const [contracts, setContracts] = useState([]);
    const contractsRef = useRef(null);
    const stateText = getMaterialState(materialState.result);
    useEffect(() => {
        if (materialState.vendor_id !== 0) {
            fetch(`http://172.16.3.101:54321/api/get-vendor-contracts/${materialState.vendor_id}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => setContracts(respJ))
                .catch(ex => console.log(ex))
        }
        else
            setContracts([]);
    }, [materialState.vendor_id, props.token]);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = Number(e.target.value);
        setMaterialState(prev => ({ ...prev, [name]: value }))
    }
    const sendToPayment = () => {
        if (materialState.vendor_id && materialState.contract_id) {
            const data = JSON.stringify({
                id: materialState.id,
                vendorid: materialState.vendor_id,
                contractid: materialState.contract_id
            })
            fetch('http://172.16.3.101:54321/api/forward-to-payment', {
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
                    if (respJ[0].operation_result === 'success') {
                        setMaterialState(respJ)
                        props.setOperationResult(prev => ({ ...prev, ...{ visible: true, desc: 'Əməliyyat uğurla tamamlandı' } }))
                    }
                    else
                        props.setOperationResult({ visible: true, desc: 'Xəta baş verdi' })
                })
        }
        else
            props.setOperationResult({ visible: true, desc: 'Xəta baş verdi' })
    }
    const sendToAgreement = () => {
        const data = JSON.stringify({
            id: materialState.id
        });
        fetch('http://172.16.3.101:54321/api/send-to-staging-area', {
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
                if (respJ.length === 0)
                    props.setOperationResult(prev => ({ ...prev, ...{ visible: true, desc: 'Əməliyyat uğurla tamamlandı' } }))
                else
                    props.setOperationResult({ visible: true, desc: respJ[0].error })
            })
            .catch(ex => console.log(ex))
    }
    return (
        <li>
            <div>{props.index + 1}</div>
            <div>{materialState.title}</div>
            <div style={{ maxWidth: '140px' }}>{materialState.amount}</div>
            <div>
                <select value={materialState.vendor_id} onChange={handleChange} name="vendor_id">
                    <option value="0">-</option>
                    {
                        props.vendors.map(vendor =>
                            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                        )
                    }
                </select>
            </div>
            <div>
                <select ref={contractsRef}>
                    <option value="0">-</option>
                    {
                        contracts.map(contract =>
                            <option key={contract.id} value={contract.id}>{contract.number}</option>
                        )
                    }
                </select>
            </div>
            <div>
                {
                    materialState.result === 0 ?
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }} >
                            <div
                                style={{ backgroundColor: 'steelblue', color: 'white', padding: '10px 20px', cursor: 'pointer' }}
                                onClick={sendToPayment}
                            >
                                Ödənişə
                            </div>
                            <div
                                style={{ backgroundColor: '#f8942a', color: 'white', padding: '10px 20px', cursor: 'pointer' }}
                                onClick={sendToAgreement}
                            >
                                Razılaşmaya
                            </div>
                        </div>
                        : materialState.result === 11 ?
                            <MdDone title="Ödənişə yönəldilib" size="30" color="green" />
                            :
                            <div></div>
                }
            </div>
            <div>{stateText}</div>
        </li>
    )
}