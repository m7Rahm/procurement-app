import React, { useState, useContext, useEffect, useRef } from 'react'
import EditOrderTableRow from './EditOrderTableRow'
import VisaForwardPerson from '../Misc/VisaForwardPerson'
import {
    IoIosAdd
} from 'react-icons/io'
import OperationResult from '../Misc/OperationResult'
import { TokenContext } from '../../App'
import { IoIosCloseCircle } from 'react-icons/io'
const EditOrderRequest = (props) => {
    const { version, onSendClick, view } = props;
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const ordNumb = props.current || props.ordNumb;
    const textareaRef = useRef(null);
    const initialValuesRef = useRef(null);
    const [empList, setEmpList] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const empListRef = useRef(null);
    const [orderState, setOrderState] = useState([]);
    const [categories, setCategories] = useState({ all: [], main: [] });
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const main = respJ.filter(category => category.parent_id === 34)
                setCategories({ all: respJ, main: main });
            })
            .catch(err => console.log(err))
    }, [token]);
    useEffect(() => {
        if (view === 'procurement') {
            fetch('http://172.16.3.101:54321/api/emplist', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    empListRef.current = respJ;
                    setEmpList(respJ);
                })
                .catch(err => console.log(err));
        }
    }, [view, token]);
    const handleSearchChange = (e) => {
        const str = e.target.value.toLowerCase();
        const searchResult = empListRef.current.filter(emp => emp.full_name.toLowerCase().includes(str));
        setSearchQuery(str);
        setEmpList(searchResult);
    }

    const handleSelectChange = (employee) => {
        const res = receivers.find(emp => emp.id === employee.id);
        const newReceivers = !res ? [...receivers, employee] : receivers.filter(emp => emp.id !== employee.id);
        setReceivers(newReceivers);
        setSearchQuery('');
    }
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/get-order-req-data?numb=${ordNumb}&vers=${version}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const orderRows = respJ.map(row => ({ ...row, id: Math.random().toString(), models: [], className: '' }));
                initialValuesRef.current = respJ;
                setOrderState(orderRows);
            })
            .catch(ex => console.log(ex))
    }, [ordNumb, version, token]);
    const handleConfirmClick = () => {
        const action = receivers.length === 0 ? 1 : 0
        const parsedMaterials = orderState.map(material =>
            [
                material.material_id,
                material.amount,
                material.approx_price * material.amount,
                material.material_comment,
                material.parent_id
            ]
        );
        const data = {
            mats: parsedMaterials,
            recs: receivers.map(receiver => [receiver.id]),
            ordNumb: ordNumb,
            empVersion: version,
            comment: textareaRef.current.value,
            action: action
        }
        const { canProceed, errorDesc } = checkResult(orderState, initialValuesRef, parsedMaterials)
        if (canProceed)
            props.editOrderAndApprove(data);
        else
            setOperationResult({ visible: true, desc: errorDesc });
    }
    const handleSendClick = () => {
        const parsedMaterials = orderState.map(material =>
            [
                material.material_id,
                material.amount,
                material.approx_price * material.amount,
                material.material_comment,
                material.parent_id
            ]
        )
        const data = {
            orderType: initialValuesRef.current[0].order_type,
            mats: parsedMaterials,
            receivers: [],
            ordNumb: ordNumb,
            structureid: orderState[0].structure_id,
            returned: view === 'returned' ? 1 : 0
        }
        const { canProceed, errorDesc } = checkResult(orderState, initialValuesRef, parsedMaterials)
        if (canProceed)
            onSendClick(data)
        else
            setOperationResult({ visible: true, desc: errorDesc })

    }
    const addNewRow = () => {
        setOrderState(prev => [...prev, {
            id: Math.random().toString(),
            models: [],
            className: 'new-row',
            parent_id: '',
            grand_parent_id: '',
            approx_value: 0,
            amount: 1,
            title: '',
            material_id: '',
            material_comment: ''
        }])
    }
    return (
        <div className="modal-content-new-order">
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                    icon={IoIosCloseCircle}
                />
            }
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Kateqoriya</div>
                    <div>Alt-Kateqoriya</div>
                    <div>Məhsul</div>
                    <div style={{ width: '170px', maxWidth: '200px' }}>Kod</div>
                    <div style={{ maxWidth: '140px' }}>Say</div>
                    <div>Kurasiya</div>
                    <div>Büccə</div>
                    <div>Əlavə məlumat</div>
                    <div> </div>
                </li>
                {
                    orderState.map((row, index) =>
                        <EditOrderTableRow
                            row={row}
                            view={view}
                            key={row.id}
                            index={index}
                            setOrderState={setOrderState}
                            categories={categories}
                            token={token}
                            ordNumb={ordNumb}
                            version={version}
                        />
                    )
                }
                {
                    view === 'returned' &&
                    <li style={{ height: '20px', backgroundColor: 'transparent' }}>
                        <div style={{ padding: '0px' }}></div>
                        <div style={{ padding: '0px' }}></div>
                        <div style={{ padding: '0px' }}></div>
                        <div style={{ padding: '0px' }}></div>
                        <div style={{ padding: '0px' }}></div>
                        <div style={{ padding: '0px' }}></div>
                        <div style={{ padding: '0px' }}>
                            <IoIosAdd title="Əlavə et" cursor="pointer" onClick={addNewRow} size="20" style={{ margin: 'auto' }} />
                        </div>
                    </li>
                }
            </ul>
            {
                view === 'procurement' &&
                <>
                    <div id="procurement-edit-section">
                        <textarea ref={textareaRef} >
                        </textarea>
                        <div style={{ minHeight: '231px' }}>
                            <div>
                                <input type="text" className="search-with-query" placeholder="İşçinin adını daxil edin.." value={searchQuery} onChange={handleSearchChange}></input>
                            </div>
                            <ul className="employees-list">
                                {
                                    empList.map(employee =>
                                        <li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee)}>
                                            {employee.full_name}
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                    <div style={{ padding: '0px 20px' }}>
                        <div style={{ marginTop: '20px', overflow: 'hidden', padding: '15px', border: '1px solid gray' }}>
                            {
                                receivers.map(emp => <VisaForwardPerson key={Math.random()} emp={emp} handleSelectChange={handleSelectChange} />)
                            }
                        </div>
                    </div>
                </>
            }
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {
                    view !== 'protected' &&
                    <div className="send-order" onClick={view === 'procurement' ? handleConfirmClick : handleSendClick}>
                        Göndər
                    </div>
                }
                {/* {
                    view === 'procurement' &&
                    <div style={{ backgroundColor: '#0F9D58' }} className="send-order" onClick={() => handleConfirmClick(1)}>
                        Təsdiq et
                    </div>
                } */}
            </div>
            
        </div>
    )
}
export default EditOrderRequest

const checkResult = (orderState, initialValuesRef, parsedMaterials) => {
    let canProceed = true;
    let errorDesc = '';
    for (let i = 0; i < parsedMaterials.length; i++)
        if (isNaN(parsedMaterials[i][0] * parsedMaterials[i][1] * parsedMaterials[i][2] * parsedMaterials[i][4])) {
            errorDesc = 'Logical Error';
            canProceed = false;
            break;
        }
    orderState.sort((a, b) => a.parent_id - b.parent_id);
    initialValuesRef.current.sort((a, b) => a.parent_id - b.parent_id);
    let budget = orderState[0].budget;
    let diff = orderState[0].approx_price * orderState[0].amount - initialValuesRef.current[0].approx_price * initialValuesRef.current[0].amount;
    for (let i = 0; i < orderState.length - 1; i++) {
        if (orderState[i].parent_id === orderState[i + 1].parent_id) {
            diff += orderState[i + 1].approx_price * orderState[i + 1].amount - initialValuesRef.current[i + 1].approx_price * initialValuesRef.current[i + 1].amount;
        }
        else {
            if (orderState[i].budget < diff) {
                errorDesc = 'Budget Overload';
                canProceed = false;
                break;
            }
            else {
                diff = orderState[i + 1].approx_price * orderState[i + 1].amount - initialValuesRef.current[i + 1].approx_price * initialValuesRef.current[i + 1].amount;
            }
        }
    }
    if (budget < diff) {
        canProceed = false;
        errorDesc = 'Budget Overload';
    }
    return ({ canProceed: canProceed, errorDesc: errorDesc })
}