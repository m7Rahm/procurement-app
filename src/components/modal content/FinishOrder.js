import React, { useState, useEffect, useContext } from 'react'
import { FaCheck } from 'react-icons/fa'
import { TokenContext } from "../../App"
import { IoMdDoneAll } from 'react-icons/io'
import useFetch from '../../hooks/useFetch';
const FinishOrder = (props) => {
    const [materials, setMaterials] = useState([]);
    const [accepted, setAccepted] = useState([]);
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const tokenContext = useContext(TokenContext);
    const userid = tokenContext[0].userData.userInfo.id;
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/order-req-data?numb=${props.ordNumb}&vers=${props.version}&confirmed=1`)
            .then(respJ => setMaterials(respJ))
            .catch(ex => console.log(ex))
    }, [fetchGet, props.ordNumb, props.version]);
    const handleAcceptedClick = (material) => {
        setAccepted(prev => prev.find(mat => mat.id === material.id) ? prev : [...prev, material])
    }
    const confirmSelection = () => {
        const materials = accepted.map(material => [material.id, material.amount - material.handed_amount === 0 ? 99 : material.handed_amount !== 0 ? 55 : 0]);
        const data = {
            orderid: props.id,
            materials: materials
        };
        fetchPost('http://192.168.0.182:54321/api/confirm-accepted', data)
            .then(respJ => {
                if (respJ[0].status !== props.status)
                    props.setOrders(prev => ({ ...prev, orders: prev.orders.map(order => order.id === props.id ? ({ ...order, status: respJ[0].status }) : order) }))
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
                                    material.result !== 99 && userid === props.version &&
                                    <div
                                        style={{ color: 'white', backgroundColor: '#0F9D58', borderRadius: '3px', padding: '2px 4px', cursor: 'pointer' }}
                                        onClick={() => handleAcceptedClick(material)}
                                    >
                                        Təhvil aldım
                                    </div>
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