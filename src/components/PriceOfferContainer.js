import React from 'react'
import PriceOffer from './modal content/PriceOffer'
const PriceOfferContainer = (props) => {
    const Compo = () => <PriceOffer active={props.active}/>
    return (
        <div className="price-offer-container">
            <Compo/>
        </div>
    )
}
export default PriceOfferContainer