import React, { useState, useEffect, useRef } from 'react'
import PotentialVendor from '../pages/Tender/PotentialVendor'
// import {
//     FaAngleDown
// } from 'react-icons/fa'
import Modal from '../components/Modal'
const ProcurementOrderContent = (props) => {
    const { order, token } = props;
    // const [orderState, setOrderState] = useState(order);
    const [action, setAction] = useState(0);
    const [expressVendors, setExpressVendors] = useState([]);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-express-vendors', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setExpressVendors(respJ))
            .catch(ex => console.log(ex))
    }, [token]);
    const handlePotentialVendorClick = () => {
        setAction(2)
    }
    // console.log(order);
    const participantsRef = useRef(null);
    const [potentialVendorsVisibility, setPotentialVendorsVisibility] = useState(false);
    const handleParticipantsTransition = () => {
        if (participantsRef.current) {
            participantsRef.current.classList.toggle('visa-content-participants-hide');
            participantsRef.current.addEventListener('animationend', () => setPotentialVendorsVisibility(prev => !prev))
        }
        else
            setPotentialVendorsVisibility(prev => !prev);
    }
    return (
        <div className="visa-content-container">
            <div>
                <div className="toggle-participants" style={{ width: 'auto' }} onClick={handleParticipantsTransition}>
                    potensial vendorları göstər
                </div>
                {
                    potentialVendorsVisibility &&
                    <Modal>

                    </Modal>
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
                        order.map((material, index) =>
                            <ProcurementOrderListItem
                                index={index}
                                expressVendors={expressVendors}
                                key={index}
                                material={material}
                            />
                        )
                    }
                </ul>
                {
                    order[0].result === 0 &&
                    <div style={{ marginBottom: '20px' }}>
                        {
                            action === 0 &&
                            <div style={{ margin: '20px' }} className="save-button" onClick={handlePotentialVendorClick}>
                                Potensial Vendor Əlavə et
                            </div>
                        }
                        {
                            action === 2 &&
                            <PotentialVendor token={token} />
                        }
                    </div>
                }
            </div>
        </div>
    )
}
const ProcurementOrderListItem = (props) => {
    const { index, material, expressVendors } = props;
    const { amount, material_name, title, material_comment, curTotal } = material;
    const handleChange = () => {

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
                <select>
                    <option value="-1">-</option>
                    {
                        expressVendors.map(expressVendor =>
                            <option key={expressVendor.id} value={expressVendor.id}>{expressVendor.name}</option>)
                    }
                </select>
            </div>
            <div >
                <input value={curTotal} onChange={handleChange} />
            </div>

        </li>
    )
}
export default ProcurementOrderContent