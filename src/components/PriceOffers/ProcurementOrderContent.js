import React, { useState, useEffect, useRef, Suspense } from 'react'
import PotentialVendorsState from '../modal content/PotentialVendorsState'
import Loading from '../Misc/Loading'
const Modal = React.lazy(() => import('../Misc/Modal'));

const ProcurementOrderContent = (props) => {
    const { order, token } = props;
    const [orderState, setOrderState] = useState(order);
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const contractNumbersRef = useRef(order.reduce((sum, current) => ({ ...sum, [current.id]: "" }), {}));
    const [expressVendors, setExpressVendors] = useState([]);
    useEffect(() => {
        setOrderState(order);
        contractNumbersRef.current = order.reduce((sum, current) => ({ ...sum, [current.id]: "" }), {});
    }, [order])
    useEffect(() => {
        fetch('http://172.16.3.101:8000/api/get-express-vendors', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setExpressVendors(respJ))
            .catch(ex => console.log(ex))
    }, [token]);

    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleSendForPayment = () => {
        let canProceed = true;
        const contracts = orderState.filter(material =>
            material.contract_id !== -1
        );
        for (let i = 0; i < contracts.length; i++)
            if (contracts[i].contract_numb !== contractNumbersRef.current[contracts[i].id]) {
                canProceed = false;
                break;
            }
        const result = contracts.length === orderState.length ? 11 : 0;
        const data = {
            ordNumb: order[0].ord_numb,
            result: result,
            conts: contracts.map(contract => [contract.id, contract.vendor_id, contract.contract_id])
        }
        console.log(data, canProceed);
    }
    return (
        <div className="visa-content-container">
            <div>
                {
                    modalState.visible &&
                    <Suspense fallback={<Loading />}>
                        <Modal changeModalState={closeModal}>
                            {modalState.content}
                        </Modal>
                    </Suspense>
                }
                <ul style={{ clear: 'both' }} className="new-order-table order-table-protex">
                    <li>
                        <div>
                            #
                        </div>
                        <div style={{ textAlign: 'left' }}>Material</div>
                        <div style={{ maxWidth: '140px' }}>Say</div>
                        <div>Əlavə məlumat</div>
                        <div style={{ maxWidth: '200px' }}>Vendor</div>
                        <div style={{ width: '150px' }}>Müqavilə nömrəsi</div>
                    </li>
                    {
                        orderState.map((material, index) =>
                            <ProcurementOrderListItem
                                index={index}
                                contractNumbersRef={contractNumbersRef}
                                setOrderState={setOrderState}
                                expressVendors={expressVendors}
                                key={material.id}
                                token={token}
                                material={material}
                            />
                        )
                    }
                </ul>
                {
                    orderState[0].result !== 11 &&
                    <div style={{ margin: '20px', backgroundColor: '#ffae00' }} className="save-button" onClick={handleSendForPayment}>
                        Ödəniş üçün yönəlt
                    </div>
                }
                {
                    orderState[0].result === 10 &&
                    <PotentialVendorsState
                        ordNumb={order[0].ord_numb}
                        token={token}
                    />
                }
            </div>
        </div>
    )
}
const ProcurementOrderListItem = (props) => {
    const { index, material, expressVendors, token, setOrderState, contractNumbersRef } = props;
    const { amount, material_name, title, material_comment, vendor_id, id } = material;
    const contractsListRef = useRef(null);
    const [contracts, setContracts] = useState([]);
    const allContracts = useRef([]);
    const inputContractNumRef = useRef(null)
    useEffect(() => {
        if (vendor_id.toString() !== -1) {
            fetch(`http://172.16.3.101:8000/api/get-vendor-contracts/${vendor_id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    allContracts.current = respJ;
                    setContracts(respJ);
                })
        }
    }, [token, vendor_id])
    const handleChange = (e) => {
        const value = e.target.value;
        contractNumbersRef.current[id] = value;
        const searchResult = allContracts.current.filter(contract => contract.number.toLowerCase().includes(value))
        setContracts(searchResult);
    }
    const handleVendorChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setOrderState(prev => prev.map(material => material.id === id ? ({ ...material, [name]: value }) : material))
    }
    const handleFocus = () => {
        contractsListRef.current.style.display = 'block'
    }
    const handleBlur = (e) => {
        const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
        if (relatedTargetid === null || relatedTargetid !== `contractsListRef ${index}`)
            contractsListRef.current.style.display = 'none'
    }
    const setContract = (contract) => {
        setOrderState(prev => prev.map(material => material.id === id ? ({ ...material, contract_id: contract.id, contract_numb: contract.number }) : material))
        contractNumbersRef.current[id] = contract.number;
        inputContractNumRef.current.value = contract.number;
        contractsListRef.current.style.display = 'none'
    }
    return (
        <li>
            <div>{index + 1}</div>
            <div style={{ textAlign: 'left' }}>
                {material_name || title}
            </div>
            <div style={{ maxWidth: '140px' }}>
                <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
                    <div style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: 'auto', flex: 1 }}>
                        {amount}
                    </div>
                </div>
            </div>
            <div>
                <span >
                    {material_comment}
                </span>
            </div>
            <div style={{ maxWidth: '200px' }}>
                <select value={vendor_id} name="vendor_id" onChange={handleVendorChange}>
                    <option value="-1">-</option>
                    {
                        expressVendors.map(expressVendor =>
                            <option key={expressVendor.id} value={expressVendor.id}>{expressVendor.name}</option>)
                    }
                </select>
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    type="text"
                    ref={inputContractNumRef}
                    autoComplete="off"
                    placeholder="Nömrə"
                />
                <ul id={`contractsListRef ${index}`} tabIndex="0" ref={contractsListRef} className="material-model-list">
                    {
                        contracts.map(contract =>
                            <li key={contract.id} onClick={() => setContract(contract)}>{contract.number}</li>
                        )
                    }
                </ul>
            </div>
        </li>
    )
}
export default ProcurementOrderContent