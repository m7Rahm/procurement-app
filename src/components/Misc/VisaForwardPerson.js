import React from 'react'
import {
    IoIosClose
} from 'react-icons/io'
const VisaForwardPerson = (props) => {
    const handleClick = (emp) => {
        //todo: delete item from array
        props.handleSelectChange(emp);

    }
    return (
        <div className="forwarded-person-card">
            <div onClick={() => handleClick(props.emp)}>
                <IoIosClose size="18" />
            </div>
            <div>
                {props.emp.full_name}
            </div>
        </div>
    )
}
export default VisaForwardPerson