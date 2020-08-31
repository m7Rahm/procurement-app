import React, { useState, useEffect } from 'react'
import PriceOfferContainer from './PriceOfferContainer'
const CreatePriceOfferFooter = (props) => {
    const [createButtonClicked, setCreateButtonClicked] = useState(false);
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
                <PriceOfferContainer active={props.active}>
                    {props.childComp}
                </PriceOfferContainer>
            }
        </>
    )
}
export default CreatePriceOfferFooter