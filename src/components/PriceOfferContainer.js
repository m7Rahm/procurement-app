import React, { useState } from 'react'
import PriceOffer from './modal content/PriceOffer'
import Modal from './Modal'
const PriceOfferContainer = (props) => {
    const [modalState, setModalState] = useState(false);
    const changeModalState = () => {
        setModalState(prev => !prev);
    }
    return (
        <div className="price-offer-container">
            {
                modalState &&
                <Modal changeModalState={changeModalState}>
                    {PriceOffer}
                </Modal>
            }
            <button onClick={changeModalState}>Click me</button>
        </div>
    )
}
export default PriceOfferContainer