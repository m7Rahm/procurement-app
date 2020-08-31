import React, { useState, Suspense, useEffect } from 'react'
import PriceOfferer from './PriceOfferer'
const OfferPictures = React.lazy(() => import('../components/modal content/OfferPictures'))

const OrderDetails = React.memo((props) => {
    return (
        <div>
            <div>{props.index}</div>
            <div>{props.material}</div>
            <div>{props.model}</div>
            <div>{props.quantity}</div>
            <div>{props.unit || 'ədəd'}</div>
        </div>
    )
}, () => true)
const PriceOfferList = (props) => {
    const [modalState, setModalState] = useState(false);
    const [pictures, setPictures] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const ordNumb = props.orderDetails[0].ord_numb;
    const empVersion = props.orderDetails[0].emp_version_id
    useEffect(() => {
        const data = {
            ordNumb,
            empVersion
        }
        fetch('http://172.16.3.101:54321/api/get-order-not-accepted-materials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(respJ => setOrderDetails(respJ))
    }, [ordNumb, empVersion])
    // console.log(props)
    return (
        <div>
            {
                modalState &&
                <Suspense fallback="">
                    <OfferPictures setModalState={setModalState} pictures={pictures} />
                </Suspense>
            }
            <div className="price-offer-table-container">
                <div className="header-container">
                    <div>
                        <div>№</div>
                        <div>Malın adı</div>
                        <div>Texniki göstərici</div>
                        <div>Miqdar</div>
                        <div>Say</div>
                    </div>
                    {
                        orderDetails.map((material, index) =>
                            <OrderDetails
                                index={index += 1}
                                key={material.id}
                                material={material.material_name}
                                model={material.model}
                                quantity={material.amount}
                                unit={material.unit}
                            />
                        )
                    }
                    <div>
                        <div>Сəm</div>
                        <div>Təxmini daşınma xərci</div>
                        <div>15% Idxal rüsumu</div>
                        <div>18% ƏDV</div>
                        <div>Yekun məbləğ</div>
                        <div>Təsdiq olunan təklif</div>
                    </div>
                </div>
                {
                    props.offerers.current.map((offerer, index) =>
                        <PriceOfferer
                            setPictures={setPictures}
                            setModalState={setModalState}
                            offerers={props.offerers}
                            key={offerer.key}
                            id={index}
                            setOfferersCount={props.setOfferersCount}
                            orderDetails={orderDetails}
                        />)
                }
            </div>
        </div>
    )
}
export default PriceOfferList