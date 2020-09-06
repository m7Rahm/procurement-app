import React, { useState, useEffect, useRef } from 'react'
import PriceOfferContainer from './PriceOfferContainer'
const CreatePriceOfferFooter = (props) => {
    const [createButtonClicked, setCreateButtonClicked] = useState(false);
    const newPriceOfferFormRef = useRef(null)
    const ordNumb = props.active[0].ord_numb
    const onCreateButtonClick = () => {
        setCreateButtonClicked(true)
    }
    useEffect(() => {
        setCreateButtonClicked(false)
    }, [ordNumb])
    return (
        <>
            {
                !props.finished && !createButtonClicked &&
                <div onClick={onCreateButtonClick} className="create-price-offer">
                    Qiymət təklifi yarat
                </div>
            }
            {
                createButtonClicked &&
                <PriceOfferContainer
                    active={props.active}
                    containerRef={newPriceOfferFormRef}
                >
                    {props.childComp}
                </PriceOfferContainer>
            }
        </>
    )
}
export default CreatePriceOfferFooter