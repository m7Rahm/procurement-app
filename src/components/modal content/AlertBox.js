import React from 'react'
import {
    AiOutlineInfoCircle
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
                <AiOutlineInfoCircle size="200" color="rgb(255, 174, 0)" />
            </div>
            <div>
                <div>Sənəddə dəyişiklik olunmuşdur</div>
                <div>Draftlara əlavə olunsun?</div>
            </div>
            <div>
                <div style={{backgroundColor: 'gray'}} onClick={handleCancel} >İmtina</div>
                <div style={{backgroundColor: '#DB4437'}} onClick={handleClick} >Xeyr</div>
                <div style={{backgroundColor: '#0F9D58'}} onClick={handleClick} >Bəli</div>
            </div>
        </div>
    )
}
export default AlertBox