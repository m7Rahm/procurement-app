import React from 'react'
import InputWithSearch from './InputWithSearch';
const NewOrderFooter = (props) => {
    const handleCommentChange = (e) => {
        props.dispatch({
            type: 'setComment',
            payload: {
                value: e.target.value
            }
        })
    }
    const handleReviewChange = (e) => {
        props.dispatch({
            type: 'setReview',
            payload: {
                value: e.target.value
            }
        })
    }
    console.log(props.empListRef.current)
    return (
        <div className="new-order-footer-wrapper">
            <div>
                <div>
                    <textarea
                        onChange={handleCommentChange}
                        name="comment"
                        disabled={props.current ? true : false}
                        value={props.comment}
                        placeholder={"Sifariş barədə əlavə qeydlər..."}
                    />
                    {
                        props.current &&
                        <textarea
                            onChange={handleReviewChange}
                            name="review"
                            value={props.review}
                            placeholder={"Qeyd"}
                        />}
                </div>
                <InputWithSearch empListRef={props.empListRef} receiversRef={props.receiversRef} />
            </div>

        </div>
    )
}
export default NewOrderFooter