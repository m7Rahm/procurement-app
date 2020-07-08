import React from 'react'
import {orders} from '../data/data'
const TableRow = (props) => {
    const importanceText = ['orta', 'vacib', 'çox vacib'];
    const materialText = ['Notebook', 'Hard Drive', 'Mouse'];
    console.log(props.materialId);
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
    const order = orders.find(order => order.number === current);
    return (
        <>
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
                <div style={{background: '#D93404'}}>Etiraz</div>
                <div style={{background: 'rgb(15, 157, 88)'}}>Təsdiq</div>
            </div>
        </>
    )
}
export default OrderContentProtected
