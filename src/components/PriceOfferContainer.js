import React from 'react'


const HOC = (Component) => (props) => {
    return (
        <Component {...props}/>
    )
}
const PriceOfferContainer = (props) => {
    const Compo = HOC(props.children)
    return (
        <div className="price-offer-container" ref={props.containerRef}>
            <Compo containerRef={props.containerRef} active={props.active}/>
        </div>
    )
}
export default PriceOfferContainer