import React from 'react'
import PriceOffer from './modal content/PriceOffer'
const PriceOfferContainer = (props) => {

    return (
        <div className="price-offer-container">
            <PriceOffer active={props.active}/>
            {/* <button onClick={changeModalState}>Click me</button> */}
        </div>
    )
}
export default PriceOfferContainer