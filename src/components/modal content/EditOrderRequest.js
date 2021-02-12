import React, { useState, useContext, useEffect, useRef } from 'react';
import EditOrderTableRow from './EditOrderTableRow';
import { IoIosAdd } from 'react-icons/io';
import OperationResult from '../Misc/OperationResult';
import { TokenContext } from '../../App';
const ForwardDocLayout = React.lazy(() => import('../../components/Misc/ForwardDocLayout'));

const EditOrderRequest = (props) => {
    const { version, onSendClick, view, editOrderAndApprove } = props;
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const ordNumb = props.current || props.ordNumb;
    const textareaRef = useRef(null);
    const initialValuesRef = useRef(null);
    const [orderState, setOrderState] = useState([]);
    const [glCategories, setGlCategories] = useState({ all: [], main: [] });
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const glCatid = orderState.length !== 0 ? orderState[0].gl_category_id : ''
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/gl-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const main = respJ.filter(glCategory => glCategory.dependent_id === null)
                setGlCategories({ all: respJ, main: main });
            })
            .catch(err => console.log(err))
    }, [token, view]);
    useEffect(() => {
        fetch(`http://192.168.0.182:54321/api/order-req-data?numb=${ordNumb}&vers=${version}`, {
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
    const handleConfirmClick = (receivers, text) => {
        const error = orderState.find(material => isNaN(material.material_id * material.amount * material.approx_price * material.sub_gl_category_id))
        if (!error) {
            const action = receivers.length === 0 ? 1 : 0
            const parsedMaterials = orderState.map(material =>
                [
                    material.id,
                    material.material_id,
                    material.amount,
                    material.approx_price * material.amount,
                    material.material_comment,
                    material.sub_gl_category_id
                ]
            );
            const data = {
                mats: parsedMaterials,
                recs: receivers.map(receiver => [receiver.id]),
                ordNumb: ordNumb,
                empVersion: version,
                comment: text,
                action: action
            }
            editOrderAndApprove(data, setOperationResult);
        }
        else
            setOperationResult({ visible: true, desc: "Məhsul seçimi düzgün deyil" })
    }
    const handleSendClick = () => {
        const error = orderState.find(material => isNaN(material.material_id * material.amount * material.approx_price * material.sub_gl_category_id))
        if (!error) {
            const parsedMaterials = orderState.map(material =>
                [
                    material.material_id,
                    material.amount,
                    material.approx_price * material.amount,
                    material.material_comment,
                    material.sub_gl_category_id
                ]);
            const data = {
                orderType: initialValuesRef.current[0].order_type,
                mats: parsedMaterials,
                receivers: [],
                ordNumb: ordNumb,
                structureid: orderState[0].structure_id,
                returned: view === 'returned' ? 1 : 0
            }
            onSendClick(data, setOperationResult)
        }
        else
            setOperationResult({ visible: true, desc: "Məhsul seçimi düzgün deyil" })
    }
    const addNewRow = () => {
        setOrderState(prev => [...prev, {
            id: Math.random().toString(),
            models: [],
            className: 'new-row',
            sub_gl_category_id: '',
            gl_category_id: '',
            approx_value: 0,
            amount: 1,
            title: '',
            material_id: '',
            material_comment: ''
        }])
    }
    const handleGlCategoryChange = (e) => {
        const value = e.target.value;
        setOrderState(prev => prev.map(material => ({ ...material, gl_category_id: Number(value) })))
    }
    return (
        <div className="modal-content-new-order">
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                />
            }
            <select
                disabled={view !== 'returned'}
                defaultValue={glCatid}
                style={{ margin: '20px', maxWidth: '250px', padding: '8px 4px' }}
                onChange={handleGlCategoryChange}
            >
                {
                    glCategories.main.map(glCategory =>
                        <option key={glCategory.id} value={glCategory.id}>{glCategory.name}</option>
                    )
                }
            </select>
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Sub-Gl Kateqoriya</div>
                    <div>Məhsul</div>
                    <div style={{ width: '170px', maxWidth: '200px', textAlign: 'left' }}>Kod</div>
                    <div style={{ maxWidth: '140px' }}>Say</div>
                    <div>Kurasiya</div>
                    <div>Büdcə</div>
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
                            glCategories={glCategories}
                            token={token}
                            glCatid={glCatid}
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
                view === 'returned' && orderState.length !== 0 &&
                <textarea ref={textareaRef} disabled={true} defaultValue={orderState[0].review} style={{ margin: '20px' }}>
                </textarea>
            }
            {
                view === 'procurement' &&
                <ForwardDocLayout
                    handleSendClick={handleConfirmClick}
                    token={token}
                />
            }
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {
                    view === 'returned' &&
                    <div className="send-order" onClick={handleSendClick}>
                        Göndər
                    </div>
                }
            </div>

        </div>
    )
}
export default EditOrderRequest