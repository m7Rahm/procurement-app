import React, { useState, useEffect } from 'react'
import { FaCheck } from 'react-icons/fa'
import { IoMdDoneAll } from 'react-icons/io'
const FinishOrder = (props) => {
    const [materials, setMaterials] = useState([]);
    const [accepted, setAccepted] = useState([]);
    useEffect(() => {
        fetch(`http://192.168.0.182:54321/api/order-req-data?numb=${props.ordNumb}&vers=${props.version}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setMaterials(respJ))
            .catch(ex => console.log(ex))
    }, [props.token, props.ordNumb, props.version]);
    const handleAcceptedClick = (material) => {
        setAccepted(prev => {
            let unique = true;
            for (let i = 0; i < prev.length; i++) {
                if (prev[i].id === material.id) {
                    unique = false;
                    break;
                }
                if (unique)
                    return [...prev, material]
            }
            if (prev.length === 0)
                return [material]
            else
                return prev
        })
    }
    const confirmSelection = () => {
        const materials = accepted.map(material => [material.id, material.amount - material.handed_amount === 0 ? 99 : material.handed_amount !== 0 ? 55 : 0]);
        const data = JSON.stringify({
            ordNumb: props.ordNumb,
            empVersion: props.version,
            materials: materials
        });
        fetch('http://192.168.0.182:54321/api/confirm-accepted', {
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
                    props.closeModal()
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div style={{ paddingBottom: '20px' }}>
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Sub-Gl Kateqoriya</div>
                    <div>Məhsul</div>
                    <div style={{ width: '170px', maxWidth: '200px', textAlign: 'left' }}>Kod</div>
                    <div style={{ maxWidth: '140px' }}>Say</div>
                    <div style={{ maxWidth: '140px' }}>T/alındı</div>
                    <div>Kurasiya</div>
                    <div>Əlavə məlumat</div>
                    <div> </div>
                    <div></div>
                </li>
                {
                    materials.map((material, index) =>
                        <li key={material.id}>
                            <div>{index + 1}</div>
                            <div>{material.sub_gl_cat_name}</div>
                            <div>{material.title}</div>
                            <div style={{ width: '170px', maxWidth: '200px', textAlign: 'left' }}>{material.product_id}</div>
                            <div style={{ maxWidth: '140px' }}>
                                {material.amount}
                            </div>
                            <div style={{ maxWidth: '140px' }}>
                                {material.handed_amount}
                            </div>
                            <div>{material.department_name}</div>
                            <div>{material.material_comment}</div>
                            <div>
                                {
                                    material.result !== 99 &&
                                    <div style={{ color: 'white', backgroundColor: '#0F9D58', borderRadius: '3px', padding: '2px 4px', cursor: 'pointer' }} onClick={() => handleAcceptedClick(material)}>Təhvil aldım</div>
                                }
                            </div>
                            <div>
                                {
                                    material.result === 99
                                        ? <IoMdDoneAll color="#0F9D58" />
                                        : material.result === 55
                                            ? <>
                                                <FaCheck color="#0F9D58" />
                                            </>
                                            : <>
                                            </>
                                }
                            </div>
                        </li>
                    )
                }
            </ul>
            {
                accepted.length !== 0 &&
                <div onClick={confirmSelection} style={{ backgroundColor: 'rgb(255, 174, 0)', color: 'white', padding: '6px' }}>
                    Seçimləri təsdiq et
                </div>
            }
        </div>
    )
}

export default FinishOrder