import React, { useState } from 'react'
const token = localStorage.getItem('token');
const AcceptDecline = React.lazy(() => import('./modal content/AcceptDecline'))

const VisaContentFooter = (props) => {
    const [comment, setComment] = useState('');
    const setIsModalOpen = (recs, order) => {
        props.setIsModalOpen(false);
        props.updateContent(recs, {
            id: order.id,
            actDateTime: order.act_date_time,
            result: order.result,
            comment: order.comment
        })
    }
    const version = props.version;
    const handleTextChange = (e) => {
        const text = e.target.value;
        setComment(text)
    }
    const handleClick = () => {
        const data = {
            receivers: [],
            action: null,
            empVersion: version,
            comment,
            forwardedVersion: version
        }
        fetch(`http://172.16.3.101:54321/api/accept-decline/${props.current}`,
            {
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
                if (respJ[0].result === 'success'){
                    console.log(respJ)
                    setComment('');
                    props.updateContent([], {
                        id: respJ[1].id,
                        actDateTime: respJ[1].act_date_time,
                        result: respJ[1].result,
                        comment: respJ[1].comment
                    })
                }
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
                                    closeModal={setIsModalOpen}
                                    version={version}
                                    vers={false}
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
                                    closeModal={setIsModalOpen}
                                    version={version}
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
                            <span >Sifarişə {props.orderContent.actDateTime} tarixində rəy verilmişdir:</span>
                            <br />
                            <span>{props.orderContent.comment}</span>
                        </div>
                }
            </>
    )
}
export default VisaContentFooter