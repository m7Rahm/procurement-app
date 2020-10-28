import React, { useContext } from 'react'
// import { TokenContext } from '../App'
import { UserDataContext } from '../pages/SelectModule'
const AcceptDecline = React.lazy(() => import('./modal content/AcceptDecline'))

const VisaContentFooter = (props) => {
    // console.log(props)
    const current = props.current;
    // const tokenContext = useContext(TokenContext);
    const userDataContext = useContext(UserDataContext);
    const canApprove = userDataContext[0].previliges.find(prev => prev === 'Sifarişi təsdiq etmək');
    const canDecline = userDataContext[0].previliges.find(prev => prev === 'Sifarişə etiraz etmək');
    const canReturn = userDataContext[0].previliges.find(prev => prev === 'Sifarişi redaktəyə qaytarmaq');
    // console.log(userDataContext[0]);
    // const token = tokenContext[0];
    // console.log(props.current)
    // const [comment, setComment] = useState('');
    const setIsModalOpen = (recs, order) => {
        console.log(order);
        props.updateContent(recs, {
            id: order.id,
            act_date_time: order.act_date_time,
            result: order.result,
            comment: order.comment
        })
    }
    // const version = current.version;
    // const handleTextChange = (e) => {
    //     const text = e.target.value;
    //     setComment(text)
    // }
    // const handleClick = () => {
    //     const data = {
    //         receivers: [],
    //         action: null,
    //         empVersion: version,
    //         comment,
    //         forwardedVersion: version
    //     }
    //     fetch(`http://172.16.3.101:54321/api/accept-decline/${props.current}`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Content-Length': JSON.stringify(data).length,
    //                 'Authorization': 'Bearer ' + token
    //             },
    //             body: JSON.stringify(data)
    //         })
    //         .then(resp => resp.json())
    //         .then(respJ => {
    //             if (respJ[0].result === 'success') {
    //                 console.log(respJ)
    //                 setComment('');
    //                 props.updateContent([], {
    //                     id: respJ[1].id,
    //                     actDateTime: respJ[1].act_date_time,
    //                     result: respJ[1].result,
    //                     comment: respJ[1].comment
    //                 })
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }
    return (
        // props.intention === 1
        //     ? 
        props.orderContent.result === 0
            ? <>
                <div className="accept-decline-container">
                    {
                        canDecline &&
                        <div
                            onClick={() => props.handleEditClick((props) =>
                                <AcceptDecline
                                    handleModalClose={setIsModalOpen}
                                    // version={version}
                                    tranid={current.id}
                                    action={-1}
                                    backgroundColor='#D93404'
                                    {...props}
                                />)
                            }
                            style={{ background: '#D93404' }}
                        >
                            Etiraz
                        </div>
                    }
                    {
                        canApprove &&
                        <div
                            onClick={() => props.handleEditClick((props) =>
                                <AcceptDecline
                                    handleModalClose={setIsModalOpen}
                                    // version={version}
                                    tranid={current.id}
                                    action={1}
                                    backgroundColor='rgb(15, 157, 88)'
                                    {...props}
                                />)
                            }
                            style={{ background: 'rgb(15, 157, 88)' }}
                        >
                            Təsdiq
                        </div>
                    }
                    {
                        canReturn && current.forward_type !== 4 &&
                        <div
                            onClick={() => props.handleEditClick((props) =>
                                <AcceptDecline
                                    handleModalClose={setIsModalOpen}
                                    tranid={current.id}
                                    // version={version}
                                    action={2}
                                    backgroundColor='#F4B400'
                                    {...props}
                                />)
                            }
                            style={{ background: '#F4B400' }}
                        >
                            Redaktəyə qaytar
                        </div>
                    }
                    {
                        current.forward_type === 3 &&
                        <div
                            onClick={() => props.handleEditClick((props) =>
                                <AcceptDecline
                                    handleModalClose={setIsModalOpen}
                                    tranid={current.id}
                                    // version={version}
                                    action={4}
                                    backgroundColor='#00a3e4'
                                    {...props}
                                />)
                            }
                            style={{ background: '#00a3e4' }}
                        >
                            Əlavə struktur cəlb et
                        </div>
                    }
                </div>
            </>
            :
            <>
            </>
        // :
        // <>
        //     {
        //         props.orderContent.comment === ''
        //             ? <div className="review-container">
        //                 <textarea placeholder="Rəy bildirin.." value={comment} onChange={handleTextChange}></textarea>
        //                 <div onClick={handleClick}>Göndər</div>
        //             </div>
        //             : <div className="review-container reviewed-comment">
        //                 <span >Sifarişə {props.orderContent.actDateTime} tarixində rəy verilmişdir:</span>
        //                 <br />
        //                 <span>{props.orderContent.comment}</span>
        //             </div>
        //     }
        // </>
    )
}
export default VisaContentFooter