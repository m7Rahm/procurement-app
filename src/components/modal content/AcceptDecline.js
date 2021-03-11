import React, { useRef } from 'react'
const AcceptDecline = (props) => {
    const { tranid, backgroundColor, action, token, setOperationResult } = props;
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
            fetch(`http://192.168.0.182:54321/api/accept-decline/${tranid}`,
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
                    if (respJ.length !== 0 && respJ[0].operation_result === 'success') {
                        const [{ origin_emp_id: originid }, ...rest] = respJ
                        const receivers = rest.map(receiver => receiver.user_id)
                        props.handleModalClose({
                            id: tranid,
                            act_date_time: "Biraz öncə",
                            result: action,
                            comment: commentRef.current.value
                        }, receivers, originid);
                    }
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