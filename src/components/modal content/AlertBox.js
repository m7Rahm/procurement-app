import React from 'react'
import {
    AiOutlineWarning
} from 'react-icons/ai'
const AlertBox = props => {
    const handleClick = () => {
        props.changeModalState()
    }
    const handleCancel = () => {
        props.setAlertVisible(false)
    }
    return (
        <div className="alert-box">
            <div>
                <AiOutlineWarning size="200" color="#ffcb59" />
            </div>
            <div>
                <div>Sənəddə dəyişiklik olunmuşdur</div>
                <div>Draftlara əlavə olunsun?</div>
            </div>
            <div>
                <div style={{backgroundColor: '#F4B400'}} onClick={handleCancel} >İmtina</div>
                <div style={{backgroundColor: '#DB4437'}} onClick={handleClick} >Xeyr</div>
                <div style={{backgroundColor: '#0F9D58'}} onClick={handleClick} >Bəli</div>
            </div>
        </div>
    )
}
export default AlertBox