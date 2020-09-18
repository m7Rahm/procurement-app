import React, { useState } from 'react'
import PriceOfferReadyTable from './PriceOfferReadyTable'
const PriceOfferCard = (props) => {
    const [showOffer, setShowOffer] = useState(false);
    const priceOfferNumb = props.offerNumb;

    const handleOfferVisibility = () => {
        setShowOffer(prev => !prev)
    }
    console.log(props)
    return (
        <>
            <div onClick={handleOfferVisibility} className="price-offer-card">
                <span>{priceOfferNumb}</span>
                <span>{props.date}</span>
            </div>
            {
                showOffer &&
                <div style={{ margin: '20px 0px' }}>
                    <PriceOfferReadyTable
                        // selectAvailable={selectAvailable}
                        priceOfferInfo={{
                            poNumb: priceOfferNumb,
                            empVersion: props.offerVersion
                        }}
                        active={props.active}
                        priceOfferNumb={priceOfferNumb}
                        canBeChanged={props.canBeChanged}
                    />
                </div>
            }
        </>
    )
}
export default PriceOfferCard