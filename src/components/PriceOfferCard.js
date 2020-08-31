import React, { useState } from 'react'
import PriceOfferReadyTable from './PriceOfferReadyTable'
const PriceOfferCard = (props) => {
    const [showOffer, setShowOffer] = useState(false);
    const priceOfferNumb = props.offerNumb;

    const handleOfferVisibility = () => {
        setShowOffer(prev => !prev)
    }
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
                        priceOfferNumb={priceOfferNumb}
                        canBeChanged={false}
                    />
                </div>
            }
        </>
    )
}
export default PriceOfferCard