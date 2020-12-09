import React, { useRef, useState, useEffect } from 'react'
import {
    FaTrashAlt,
    FaAngleDown
}
    from 'react-icons/fa'
import {
    IoIosAttach,
    IoIosClose
} from 'react-icons/io'
import {
    AiOutlinePicture
} from 'react-icons/ai'
import { workSectors } from '../data/data'
import Modal from '../components/Modal'
import Participants from './modal content/Participants'
import VisaContentMaterials from '../components/VisaContentMaterials'
const PotentialVendorRow = (props) => {
    const { index, vendor, setPotentialVendors, setModalState, pendingOrders, token } = props;
    const rowRef = useRef(null);
    const [modal, setModal] = useState({ content: null, visible: false });
    const filesRef = useRef(null);
    useEffect(() => {
        if(vendor.files.length === 0)
            filesRef.current.value = ''
    }, [vendor.files])
    const handleFileUpload = (e) => {
        const files = [];
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                file.supplier = vendor.key
                files.push(file);
            }
            setPotentialVendors(prev => prev.map(
                prevVendor => prevVendor.key !== vendor.key
                    ? prevVendor
                    : { ...prevVendor, files: files }
            ));
        }
    }
    const showFiles = () => {
        setModalState({ display: true, vendorIndex: index - 1 });
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPotentialVendors(prev => prev.map(row => row.key !== vendor.key ? row : { ...row, [name]: value }))
    }
    const handleRowDelete = () => {
        rowRef.current.classList.add('delete-row');
        rowRef.current.addEventListener('animationend',
            () => setPotentialVendors(prev => prev.filter(row => row.key !== vendor.key))
        )
    }
    const handleOrdNumbChange = (e) => {
        if (e.target.val !== '-1') {
            const val = pendingOrders[e.target.value];
            setPotentialVendors(prev =>
                prev.map(row => row.key !== vendor.key
                    ? row
                    : { ...row, orders: row.orders.findIndex(ord => ord.id === val.id) === -1 ? [...row.orders, val] : row.orders }
                )
            )
        }
    }
    const handleRemove = (order) => {
        setPotentialVendors(prev =>
            prev.map(row => row.key !== vendor.key
                ? row
                : { ...row, orders: row.orders.filter(ord => ord.id !== order.id) }
            )
        )
    }
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
    const closeModal = () => {
        setModal({ visible: false, content: null })
    }
    return (
        <>
            <li ref={rowRef} className={vendor.className}>
                <div>
                    <div>{index}</div>
                    <div>
                        <input type="text" name="name" placeholder="Name" value={vendor.name} onChange={handleChange} />
                    </div>
                    <div>
                        <input type="text" name="voen" placeholder="VOEN" value={vendor.voen} onChange={handleChange} />
                    </div>
                    <div>
                        <select name="sphere" value={vendor.sphere} onChange={handleChange} >
                           {
                               workSectors.map(sphere =>
                                    <option key={sphere.val} value={sphere.val}>{sphere.text}</option>
                                )
                           }
                        </select>
                    </div>
                    <div>
                        <input type="text" name="comment" placeholder="Comment" value={vendor.comment} onChange={handleChange} />
                    </div>
                    <div>
                        <select onChange={handleOrdNumbChange}>
                            <option value="-1">-</option>
                            {
                                pendingOrders.map((order, index) =>
                                    <option
                                        value={index}
                                        key={order.id}
                                    >
                                        {order.ord_numb}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor={`file-upload ${vendor.key}`}>
                            <IoIosAttach cursor="pointer" color="#ff4a4a" onClick={handleFileUpload} title="şəkil əlavə et" size="20" />
                        </label>
                        {
                            vendor.files.length !== 0 &&
                            <AiOutlinePicture onClick={showFiles} className="pictures-thumb" size="20" />
                        }
                        <input
                            id={`file-upload ${vendor.key}`}
                            style={{ display: 'none' }}
                            ref={filesRef}
                            onChange={handleFileUpload}
                            accept=".pdf"
                            type="file"
                            multiple={true}
                        />
                    </div>
                    <div>
                        <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
                    </div>
                </div>
                <div className="ord-numbs">
                    {
                        vendor.orders.map(ord =>
                            <div key={ord.id}>
                                <div style={{ cursor: 'pointer' }} className="forwarded-person-card">
                                    <div onClick={() => handleRemove(ord)}>
                                        <IoIosClose size="18" />
                                    </div>
                                    <div onClick={() => showOrderContent(ord)}>
                                        {ord.ord_numb}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </li>
            {
                modal.visible &&
                <Modal changeModalState={closeModal}>
                    {modal.content}
                </Modal>
            }
        </>
    )
}
export const OrderContent = (props) => {
    const { version, ordNumb, token, order } = props;
    const [content, setContent] = useState([]);
    const participantsRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false)
    useEffect(() => {
        const data = JSON.stringify({
            ordNumb: ordNumb,
            version: version
        })
        fetch('http://172.16.3.101:54321/api/get-order-materials', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => setContent(respJ))
            .catch(ex => console.log(ex))
    }, [token, version, ordNumb]);
    const handleParticipantsTransition = () => {
        if (participantsRef.current) {
            participantsRef.current.classList.toggle('visa-content-participants-hide');
            participantsRef.current.addEventListener('animationend', () => setParticipantsVisiblity(prev => !prev))
        }
        else
            setParticipantsVisiblity(prev => !prev);
    }
    return (
        content.length !== 0 &&
        <div>
            <div>{order.full_name} {order.department_name}</div>
            <VisaContentMaterials
                orderContent={content}
                canProceed={true}
                forwardType={content[0].forwardType}
            />
            <div className="toggle-participants" onClick={handleParticipantsTransition}>
                Tarixçəni göstər
                <FaAngleDown size="36" color="royalblue" />
            </div>
            {
                participantsVisiblity &&
                <div ref={participantsRef} className="visa-content-participants-show">
                    <Participants
                        empVersion={version}
                        number={ordNumb}
                    />
                </div>
            }
        </div>
    )
}
export default React.memo(PotentialVendorRow)