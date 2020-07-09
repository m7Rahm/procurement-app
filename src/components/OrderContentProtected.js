import React, { useState, Suspense } from 'react';
import { orders } from '../data/data';
import Modal from './Modal'
import {
    FaEdit,
    FaUndo
} from 'react-icons/fa'
const NewOrderContent = React.lazy(() => import('./modal content/NewOrder'));
const AcceptDecline = React.lazy(() => import('./modal content/AcceptDecline'))

const TableRow = (props) => {
    const importanceText = ['orta', 'vacib', 'çox vacib'];
    const materialText = ['Notebook', 'Hard Drive', 'Mouse'];
    return (
        <li>
            <div>{props.index + 1}</div>
            <div>
                {materialText[props.materialId - 1]}
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
    const order = orders.find(order => order.number === current);
    const handleModalClose = () => {
        setIsModalOpen(false)
    }
    const handleEditClick = (content) => {
        setModalContent(content);
        setIsModalOpen(true)
    }
    return (
        <>
            <div>
                {
                    isModalOpen &&
                    <Suspense fallback={
                        <div className="loading">
                            <FaUndo size="50" color="#a4a4a4" />
                        </div>
                    }>
                        <Modal number={current} changeModalState={handleModalClose}>
                            {modalContent}
                        </Modal>
                    </Suspense>
                }
                <h1 className="protex-order-header">
                    {`Sifariş № ${current}`}
                    <FaEdit onClick={()=>handleEditClick(<NewOrderContent current={current} />)} title="düzəliş et" size="20" />
                </h1>
                <div className="new-order-header">
                    <div>
                        <label htmlFor="destination" color="#555555">Təyinatı</label>
                        <br />
                        <div style={{ clear: 'both', fontSize: '22px', fontWeight: '555', color: 'gray' }}>{order.category}</div>
                    </div>
                    <div>
                        <label htmlFor="deadline" color="#555555">Deadline</label>
                        <div style={{ clear: 'both', fontSize: '22px', fontWeight: '550', color: 'gray'}}>{order.deadline}</div>
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
                    order.materials.map((material, index) =>
                        <TableRow
                            index={index}
                            id={material.id}
                            key={material.id}
                            amount={material.amount}
                            model={material.model}
                            additionalInfo={material.additionalInfo}
                            importance={material.importance}
                            materialId={material.materialId}
                        />
                    )
                }
            </ul>
            <div>
                <div onClick={()=>handleEditClick(<AcceptDecline accept={false} backgroundColor='#D93404'/>)} style={{ background: '#D93404' }}>Etiraz</div>
                <div onClick={()=>handleEditClick(<AcceptDecline accept={true} backgroundColor='rgb(15, 157, 88)'/>)} style={{ background: 'rgb(15, 157, 88)' }}>Təsdiq</div>
            </div>
        </>
    )
}
export default OrderContentProtected
