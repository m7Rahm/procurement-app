import React from 'react'
import PriceOfferTable from '../PriceOfferTable'
const PriceOffer = (props) => {
    return (
        <>
            <PriceOfferTable />
            <div className="add-new-price-offerer">Əlavə et</div>
            <div className="add-new-price-offerer">Göndər </div>
        </>
    )
}
export default PriceOffer