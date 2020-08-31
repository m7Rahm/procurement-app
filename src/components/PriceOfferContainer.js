import React from 'react'


const HOC = (Component) => (props) => {
    return (
        <Component {...props}/>
    )
}
const PriceOfferContainer = (props) => {
    const Compo = HOC(props.children)
    return (
        <div className="price-offer-container">
            <Compo active={props.active}/>
        </div>
    )
}
export default PriceOfferContainer