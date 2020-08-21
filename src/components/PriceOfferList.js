import React, { useState, Suspense } from 'react'
import PriceOfferer from './PriceOfferer'
const OfferPictures = React.lazy(() => import('../components/modal content/OfferPictures'))

const OrderDetails = (props) => {
    return (
        <div>
            <div>1</div>
            <div>{props.material}</div>
            <div>{props.model}</div>
            <div>{props.quantity}</div>
            <div>{props.unit}</div>
        </div>
    )
}
const PriceOfferList = (props) => {
    const [modalState, setModalState] = useState(false);
    const [pictures, setPictures] = useState([]);

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
                        props.orderDetails.map(material =>
                            <OrderDetails
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
                            orderDetails={props.orderDetails}
                        />)
                }
            </div>
        </div>
    )
}
export default PriceOfferList