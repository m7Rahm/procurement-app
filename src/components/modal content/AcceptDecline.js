import React, { useRef } from 'react'
const AcceptDecline = (props) => {
    const { tranid, backgroundColor, action, token, setOperationResult, handleModalClose } = props;
    const commentRef = useRef(null);
    const placeholder = action
        ? "Əlavə qeydlərinizi daxil edin.."
        : "Səbəb göstərin";
    const handleClick = () => {
        if ((commentRef.current.value !== '' || action !== -1)) {
            const data = JSON.stringify({
                action: action,
                comment: commentRef.current.value,
            })
            fetch(`http://172.16.3.101:8000/api/accept-decline/${tranid}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length,
                        'Authorization': 'Bearer ' + token
                    },
                    body: data
                })
                .then(resp => resp.json())
                .then(respJ => {
                    console.log(respJ)
                    if (respJ[0].operation_result === 'success')
                        handleModalClose([respJ[0].head_id], respJ[0])
                    else if (respJ[0].error)
                        setOperationResult({ visible: true, desc: respJ[0].error })
                })
                .catch(err => console.log(err))
        }
    }
    return (
        <div className="accept-decline">
            <div>
                <textarea
                    style={{ minHeight: '150px' }}
                    placeholder={placeholder}
                    ref={commentRef}
                >
                </textarea>
            </div>
            <div onClick={handleClick} style={{ backgroundColor: backgroundColor }}>
                Göndər
            </div>
        </div>
    )
}
export default AcceptDecline