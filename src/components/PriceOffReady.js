import React from 'react'
import PriceOfferReadyTable from './PriceOfferReadyTable'
const PriceOffReady = (props) => {

    return (
        <>
            <PriceOfferReadyTable
                // selectAvailable={selectAvailable}
                priceOfferInfo={{
                    poNumb: props.active[0].priceOfferIden,
                    empVersion: props.active[0].emp_version_id
                }}
                canBeChanged={true}
                active={props.active}
                priceOfferNumb={props.active[0].priceOfferIden}
            />

        </>
    )
}
export default PriceOffReady