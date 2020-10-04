import React from 'react'
import {
    AiOutlineInfoCircle
} from 'react-icons/ai'
const token = localStorage.getItem('token');
const AlertBox = props => {
    const handleClick = (action) => {
        // props.stateRef.current.latest.receivers = props.empListRef.current;
        // console.log(props.stateRef.current.latest);
        if (action === true) {
            const parsedMaterials = props.stateRef.current.latest.materials.map(material =>
                [
                    material.materialId,
                    material.amount,
                    material.additionalInfo,
                    material.model,
                    material.importance
                ]
            )
            const data = {
                deadline: props.stateRef.current.latest.deadline,
                mats: parsedMaterials,
                receivers: props.stateRef.current.receivers.map(emp => emp.id),
                comment: props.stateRef.current.latest.comment,
                assignment: props.stateRef.current.latest.assignment,
                ordNumb: '',
                review: props.stateRef.current.latest.review
            }
            // console.log(data);
            fetch('http://172.16.3.101:54321/api/add-to-drafts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length,
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success')
                props.changeModalState()
            })
            .catch(ex => console.log(ex))
        }
        else
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
                <div style={{ backgroundColor: 'gray' }} onClick={handleCancel} >İmtina</div>
                <div style={{ backgroundColor: '#DB4437' }} onClick={() => handleClick(false)} >Xeyr</div>
                <div style={{ backgroundColor: '#0F9D58' }} onClick={() => handleClick(true)} >Bəli</div>
            </div>
        </div>
    )
}
export default AlertBox