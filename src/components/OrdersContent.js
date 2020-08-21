import React from 'react'
import PriceOfferContainer from './PriceOfferContainer'
import OrderContentProtected from './OrderContentProtected'

const footerComponent = () =>
    <>
    </>


const OrdersContent = (props) => {
    return (
        <div
            style={{
                display: 'flex',
                flexFlow: 'column wrap',
                flex: 1,
                maxWidth: '1256px',
                paddingTop: '100px',
                margin: 'auto',
                overflowY: 'hidden',
                maxHeight: '100vh'
                }}>
            <div style={{overflow: 'auto'}}>
                <OrderContentProtected footerComponent={footerComponent} current={props.current} />
                <PriceOfferContainer active={props.current} />
            </div>
        </div>
    )
}
export default OrdersContent