import React, { useEffect, useState, useRef } from 'react'
import {
    AiOutlinePicture
} from 'react-icons/ai'
import { MdClose, MdDone } from 'react-icons/md'
import Modal from '../Misc/Modal'
import { OrderContent } from './PotentialVendorRow'
import { VendorInfo } from '../modal content/PotentialVendorsState'
import ForwardDocLayout from '../Misc/ForwardDocLayout'
import OperationResult from '../Misc/OperationResult'
const PriceOffer = (props) => {
    const { current, token, tranid } = props;
    const [priceOfferState, setPriceOfferState] = useState(current);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
    const [modal, setModal] = useState({ content: null, visible: false })
    const showFiles = (vendor) => {
        const vendorid = vendor.vendor_id;
        const content = (props) =>
            <VendorInfo
                version={priceOfferState[0].version}
                token={token}
                vendorid={vendorid}
                {...props}
            />
        setModal({ visible: true, content: content })
    }
    const confirmSelections = (receivers = []) => {
        const data = JSON.stringify({
            priceOfferActs: priceOfferState.map(vendor => [vendor.vendor_id, vendor.review, vendor.action === 1 ? 1 : -1]),
            recs: receivers.map(receiver => [receiver.id])
        });
        fetch(`http://172.16.3.101:8000/api/accept-decline-potential-vendor/${tranid}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].operation_result === 'success')
                    setPriceOfferState(prev => prev.map(vendor => ({ ...vendor, processed: 1 })))
                else if (respJ[0].error)
                    setOperationResult({ visible: true, desc: respJ[0].error })
            })
            .catch(ex => console.log(ex))
    }
    const closeModal = () => {
        setModal({ visible: false, content: null })
    }
    useEffect(() => setPriceOfferState(current), [current])
    return (
        <>
            {
                modal.visible &&
                <Modal changeModalState={closeModal}>
                    {modal.content}
                </Modal>
            }
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                />
            }
            <div className="visa-content-container">
                {
                    priceOfferState.length !== 0
                        ? <>
                            <ul style={{ margin: '20px' }} className="modified">
                                <li>
                                    <div>#</div>
                                    <div>Name</div>
                                    <div>VOEN</div>
                                    <div>Sphere</div>
                                    <div>Comment</div>
                                    <div>Attachment</div>
                                    <div></div>
                                </li>
                                {
                                    priceOfferState.map((vendor, index) =>
                                        <PotentialVendor
                                            vendor={vendor}
                                            key={vendor.id}
                                            index={index}
                                            token={token}
                                            setPriceOfferState={setPriceOfferState}
                                            showFiles={showFiles}
                                            processed={priceOfferState[0].processed}
                                            setModal={setModal}
                                        />
                                    )
                                }
                            </ul>
                            {
                                priceOfferState[0].processed !== 1 && priceOfferState[0].forward_type !== 2 &&
                                <div onClick={() => confirmSelections()} className="send-order">
                                    Seçimləri təsdiqlə
                                </div>
                            }
                            {
                                priceOfferState[0].forward_type === 2 && priceOfferState[0].processed !== 1 &&
                                <ForwardDocLayout
                                    handleSendClick={confirmSelections}
                                    token={token}
                                />
                            }
                        </>
                        : <>
                            <div style={{ marginTop: '100px' }}>
                                <img
                                    src={require('../../Konvert.svg')}
                                    alt="blah"
                                    height="70"
                                    style={{ marginBottom: '20px' }} />
                                <br />
                                <span style={{ color: 'gray', fontSize: 20 }}>Baxmaq üçün sənədi seçin</span>
                            </div>
                        </>
                }
            </div>
        </>
    )
}
const PotentialVendor = (props) => {
    const { vendor, index, token, showFiles, setModal, setPriceOfferState, processed } = props;
    const rowRef = useRef(null);
    const handleSelect = (action) => {
        if (!processed) {
            const color = action === 1 ? 'rgba(15, 157, 88, 0.345)' : 'rgba(217, 54, 4, 0.450)';
            setPriceOfferState(prev => prev.map((vendor, inx) => inx === index ? { ...vendor, action: action } : vendor))
            rowRef.current.style.backgroundColor = color;
        }
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPriceOfferState(prev => prev.map((vendor, inx) => inx === index ? { ...vendor, [name]: value } : vendor))
    }
    return (
        <li style={{ backgroundColor: vendor.action === 1 ? 'rgba(15, 157, 88, 0.345)' : vendor.action === -1 ? 'rgba(217, 54, 4, 0.450)' : '' }} ref={rowRef}>
            <div>
                <div>{index + 1}</div>
                <div>{vendor.name}</div>
                <div>{vendor.voen}</div>
                <div>
                    <select disabled name="sphere" defaultValue={vendor.sphere} >
                        <option value="0">Satış</option>
                        <option value="1">Ximət</option>
                    </select>
                </div>
                <div>{vendor.comment}</div>
                <div>
                    <AiOutlinePicture
                        onClick={() => showFiles(vendor)}
                        style={{ float: 'none' }}
                        className="pictures-thumb"
                        size="20"
                    />
                </div>
                <div>
                    {
                        processed === 0 &&
                        <>
                            <MdDone onClick={() => handleSelect(1)} cursor="pointer" color="green" size="20" />
                            <MdClose onClick={() => handleSelect(-1)} cursor="pointer" color="red" size="20" />
                        </>
                    }
                </div>
            </div>
            <div>
                <PotentialVendorOrdNumbers
                    version={vendor.version}
                    token={token}
                    setModal={setModal}
                    vendor_id={vendor.vendor_id}
                />
            </div>
            <div style={{ padding: '5px' }}>
                <textarea
                    value={vendor.review}
                    disabled={processed}
                    style={{ width: '100%', maxHeight: '40px' }}
                    placeholder="Qeyd.."
                    onChange={handleChange}
                    name="review"
                >
                </textarea>
            </div>
        </li>
    )
}
const PotentialVendorOrdNumbers = (props) => {
    const { vendor_id, version, token, setModal } = props;
    const [ordNums, setOrdNums] = useState([]);
    useEffect(() => {
        const data = JSON.stringify({
            version: version,
            vendorid: vendor_id
        })
        fetch('http://172.16.3.101:8000/api/express-get-ord-nums-per-vendor', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => setOrdNums(respJ))
            .catch(ex => console.log(ex))
    }, [vendor_id, version, token]);
    const showOrderContent = (ord) => {
        const content = (props) =>
            <OrderContent
                ordNumb={ord.ord_numb}
                order={ord}
                version={ord.emp_id}
                token={token}
                {...props}
            />
        setModal({ visible: true, content: content })
    }
    return (
        ordNums.map(ord =>
            <div key={ord.id} className="forwarded-person-card">
                <div>
                </div>
                <div onClick={() => showOrderContent(ord)} style={{ cursor: 'pointer' }}>
                    {ord.ord_numb}
                </div>
            </div>
        )
    )
}
export default PriceOffer
