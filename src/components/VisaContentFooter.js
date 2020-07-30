import React, { useState } from 'react'
const AcceptDecline = React.lazy(() => import('./modal content/AcceptDecline'))

const VisaContentFooter = (props) => {
   //  console.log(props);
    const [comment, setComment] = useState('');
    const handleTextChange = (e) => {
        const text = e.target.value;
        setComment(text)
    }
    const handleClick = () => {
        const data = {
            receivers: [],
            action: null,
            empVersion: null,
            comment
        }
        fetch(`http://172.16.3.101:54321/api/accept-decline/${props.current}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length
                },
                body: JSON.stringify(data)
            })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success')
                    fetch(`http://172.16.3.101:54321/api/refresh-order-content?empVersion=${props.version}&orderNumb=${props.current}`)
                    .then(resp => resp.json())
                    .then(respJ => {
                        props.setUpdatedContent({
                            id: respJ[0].id,
                            actDateTime: respJ[0].act_date_time,
                            result: respJ[0].result,
                            comment: respJ[0].comment
                        })
                    })
            })
            .catch(err => console.log(err))
    }
    return (
        props.intention === 1
            ? props.orderContent.result === null
                ? <>
                    <div className="accept-decline-container">
                        <div
                            onClick={() => props.handleEditClick((props) =>
                                <AcceptDecline
                                    closeModal={props.setIsModalOpen(false)}
                                    version={props.version}
                                    accept={false}
                                    backgroundColor='#D93404'
                                    {...props}
                                />)
                            }
                            style={{ background: '#D93404' }}
                        >
                            Etiraz
                    </div>
                        <div
                            onClick={() => props.handleEditClick((props) =>
                                <AcceptDecline
                                    closeModal={props.setIsModalOpen(false)}
                                    version={props.version}
                                    accept={true}
                                    backgroundColor='rgb(15, 157, 88)'
                                    {...props}
                                />)
                            }
                            style={{ background: 'rgb(15, 157, 88)' }}
                        >
                            Təsdiq
                        </div>
                    </div>
                </>
                :
                <>
                </>
            :
            <>
                {
                    props.orderContent.comment === ''
                        ? <div className="review-container">
                            <textarea placeholder="Rəy bildirin.." value={comment} onChange={handleTextChange}></textarea>
                            <div onClick={handleClick}>Göndər</div>
                        </div>
                        : <div className="review-container reviewed-comment">
                            <span >Sifarişə {props.orderContent.act_date_time} tarixində rəy verilmişdir:</span>
                            <br />
                            <span>{props.orderContent.comment}</span>
                        </div>
                }
            </>
    )
}
export default VisaContentFooter