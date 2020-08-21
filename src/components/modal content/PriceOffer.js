import React, { useRef, useState } from 'react'
import PriceOfferList from '../PriceOfferList'
const PriceOffer = (props) => {
    const offerers = useRef([]);
    const [offerersCount, setOfferersCount] = useState(0)
    const addOfferer = () => {
        offerers.current.push({ key: Math.random() })
        setOfferersCount(prev => prev + 1);
    }
    return (
        // <div style={{ maxWidth: '1256px', margin: 'auto' }}>
        <>
            <PriceOfferList
                orderDetails={props.active}
                setOfferersCount={setOfferersCount}
                offerers={offerers}
                offerersCount={offerersCount}
            />
            <div className="add-new-price-offerer" onClick={addOfferer}>Əlavə et</div>
            <div style={{ backgroundColor: 'rgb(255, 174, 0)' }} className="add-new-price-offerer">Göndər </div>
        </>
    )
}
export default PriceOffer