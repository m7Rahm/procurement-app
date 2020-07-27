import React, { useState, Suspense, useEffect } from 'react';
import Modal from './Modal'
import {
    FaEdit,
    FaUndo
} from 'react-icons/fa'
const NewOrderContent = React.lazy(() => import('./modal content/NewOrder'));
const AcceptDecline = React.lazy(() => import('./modal content/AcceptDecline'))

const TableRow = (props) => {
    const importanceText = ['orta', 'vacib', 'çox vacib'];
    return (
        <li>
            <div>{props.index + 1}</div>
            <div>
                {props.materialName}
            </div>
            <div>
                <span>
                    {props.model}
                </span>
            </div>
            <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
                <div id={props.id} style={{ height: '100%', textAlign: 'left', boxShadow: `${props.isActive ? '0px 0px 0px 1.6px royalblue' : ''}` }} className={`importance-div`}>
                    {importanceText[props.importance - 1]}
                </div>
            </div>
            <div style={{ maxWidth: '140px' }}>
                <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
                    <div style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: 'auto', flex: 1 }}>
                        {props.amount}
                    </div>
                </div>
            </div>
            <div>
                <span style={{ width: '100%' }} >
                    {props.additionalInfo}
                </span>
            </div>
        </li>
    )
}

const OrderContentProtected = (props) => {
    const current = props.current;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [orderContent, setOrderContent] = useState(null);
    const handleModalClose = () => {
        setIsModalOpen(false)
    }
    const handleEditClick = (content) => {
        setModalContent(_ => content);
        setIsModalOpen(true);
    }
    useEffect(() => {
        const data = {
            senderid: current.senderid,
            orderid: current.number
        }
        fetch(`http://172.16.3.101:54321/api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                console.log(respJ)
                setOrderContent(respJ)
            })
            .catch(error => console.log(error));
    }, [current])
    return (
        orderContent &&
        <>
            <div>
                {
                    isModalOpen &&
                    <Suspense fallback={
                        <div className="loading">
                            <FaUndo size="50" color="#a4a4a4" />
                        </div>
                    }>
                        <Modal number={current.number} changeModalState={handleModalClose}>
                            {modalContent}
                        </Modal>
                    </Suspense>
                }
                <h1 className="protex-order-header">
                    {`Sifariş № ${current.number}`}
                    <FaEdit onClick={() => handleEditClick((props) => <NewOrderContent content={orderContent} {...props} />)} title="düzəliş et" size="20" />
                </h1>
                <div className="new-order-header">
                    <div>
                        <label htmlFor="destination" color="#555555">Təyinatı</label>
                        <br />
                        <div style={{ clear: 'both', fontSize: '22px', fontWeight: '555', color: 'gray' }}>{orderContent[0].assignment}</div>
                    </div>
                    <div>
                        <label htmlFor="deadline" color="#555555">Deadline</label>
                        <div style={{ clear: 'both', fontSize: '22px', fontWeight: '550', color: 'gray' }}>{orderContent[0].deadline}</div>
                    </div>
                </div>
            </div>
            <ul className="new-order-table order-table-protex">
                <li>
                    <div>#</div>
                    <div>Material</div>
                    <div>Model</div>
                    <div style={{ width: '170px', maxWidth: '200px' }}>Vaciblik</div>
                    <div style={{ maxWidth: '140px' }}>Say</div>
                    <div>Əlavə məlumat</div>
                </li>
                {
                    orderContent.map((material, index) =>
                        <TableRow
                            index={index}
                            id={material.material_id}
                            key={index}
                            amount={material.amount}
                            model={material.model}
                            additionalInfo={material.material_comment}
                            importance={material.importance}
                            materialName={material.material_name}
                        />
                    )
                }
            </ul>
            {
                orderContent[0].intention === 1
                    ? <div className="accept-decline-container">
                        <div onClick={() => handleEditClick((props) => <AcceptDecline accept={false} backgroundColor='#D93404' {...props} />)} style={{ background: '#D93404' }}>Etiraz</div>
                        <div onClick={() => handleEditClick((props) => <AcceptDecline accept={true} backgroundColor='rgb(15, 157, 88)'{...props} />)} style={{ background: 'rgb(15, 157, 88)' }}>Təsdiq</div>
                    </div>
                    : <div className="review-container">
                        <textarea placeholder="Rəy bildirin.."></textarea>
                        <div>Göndər</div>
                    </div>
            }
        </>
    )
}
export default OrderContentProtected
