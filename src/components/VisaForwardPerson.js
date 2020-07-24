import React from 'react'
import {
    IoIosClose
} from 'react-icons/io'
const VisaForwardPerson = (props) => {
    const handleClick = (id) => {
        //todo: delete item from array
        props.setReceivers(prev => prev.filter(elem => elem.id !== id))
    }
    return (
        <div className="forwarded-person-card">
            <div onClick={() => handleClick(props.id)}>
                <IoIosClose size="18" />
            </div>
            <div>
                {props.name}
            </div>
        </div>
    )
}
export default VisaForwardPerson