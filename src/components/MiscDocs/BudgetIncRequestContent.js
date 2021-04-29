import React, { useEffect, useRef, useState } from 'react'
import { months } from '../../data/data'
import ParticipantsUniversal from '../Common/ParticipantsUniversal'
import { FaAngleDown, FaCheck, FaTimes } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
const BudgetIncRequestContent = (props) => {
    const { docid, docType } = props;
    const [docState, setDocState] = useState({ content: [], active: false });
    const comment = docState.content.length !== 0 ? docState.content[0].comment : "";
    const textareaRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
    const participantsRef = useRef(null);
    let result = undefined;
    let time = undefined;
    if (docState.content.length && docState.content[0].user_result !== 0 && docState.content[0].tran_id) {
        result = docState.content[0].user_result === 1 ? true : false;
        time = docState.content[0].action_date_time;
    } else if (docState.content.length && docState.content[0].doc_result !== 0 && !docState.content[0].tran_id) {
        result = docState.content[0].doc_result === 1 ? true : false;
        time = docState.content[0].doc_action_date_time;
    }
    const fetchDocContent = useFetch("GET");
    const fetchAcceptDecline = useFetch("POST");
    useEffect(() => {
        const abortController = new AbortController();
        if (docid) {
            fetchDocContent(`http://192.168.0.182:54321/api/misc-doc-content?docid=${docid}&docType=${docType}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setDocState({ content: respJ, active: respJ[0].doc_result === 0 && !respJ[0].user_result })
                        if (textareaRef.current)
                            textareaRef.current.value = respJ[0].review
                    }
                })
                .catch(ex => console.log(ex))
        }
    }, [fetchDocContent, docid, docType]);
    const handleParticipantsTransition = () => {
        if (participantsRef.current) {
            participantsRef.current.classList.toggle('visa-content-participants-hide');
            participantsRef.current.addEventListener('animationend', () => {
                if (participantsRef.current)
                    setParticipantsVisiblity(prev => !prev)
            })
        }
        else
            setParticipantsVisiblity(prev => !prev);
    }
    const acceptDeclince = (action) => {
        const abortController = new AbortController();
        const data = {
            action: action,
            tranid: docState.content[0].tran_id,
            docid: docid,
            comment: textareaRef.current.value
        }
        fetchAcceptDecline("http://192.168.0.182:54321/api/accept-budget-inc-req", data, abortController)
            .then(_ => {
                setDocState(prev => ({ content: prev.content.map(row => ({ ...row, user_result: action })), active: false }))
                props.setInitData(prev => ({ ...prev }))
            })
            .catch(ex => console.log(ex))
    }
    const cancel = () => {

    }
    return (
        docState.content.length &&
        <div className="visa-content-container">
            <div style={{ maxWidth: "1024px", margin: "auto", padding: "0px 10px" }}>
                <h1>
                    {
                        result !== undefined &&
                        <div>
                            {
                                result === true
                                    ? <FaCheck size="20" color="green" style={{ float: "left" }} />
                                    : <FaTimes size="20" color="red" style={{ float: "left" }} />
                            }
                            <h1 style={{ float: "right", fontSize: "20px", color: "goldenrod" }} >{time}</h1>
                        </div>
                    }
                </h1>
                <table className="new-budget users-table" style={{ marginTop: "56px" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>Il</th>
                            <th style={{ textAlign: "center" }}>Ay</th>
                            <th style={{ textAlign: "center" }}>Gl Kateqoriya</th>
                            <th style={{ textAlign: "center" }}>Sub-Gl Kateqoriya</th>
                            <th style={{ textAlign: "center" }}>Struktur</th>
                            <th style={{ textAlign: "center" }}>Büdcə</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            docState.content.map(budget =>
                                <tr key={budget.id}>
                                    <td style={{ width: "auto" }}>{budget.year}</td>
                                    <td style={{ width: "auto" }}>{months[budget.month - 1].name}</td>
                                    <td style={{ width: "auto" }}>{budget.gl_parent_name}</td>
                                    <td style={{ width: "auto" }}>{budget.gl_name}</td>
                                    <td style={{ width: "auto" }}>{budget.structure_name}</td>
                                    <td style={{ width: "auto" }}>{budget.amount}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <p>{comment}</p>
                {
                    docState.active &&
                    <>
                        {
                            docState.content[0].tran_id
                                ? <>
                                    <textarea ref={textareaRef} placeholder="Qeydlərinizi daxil edin.." style={{ width: '82%', minHeight: '100px' }} />
                                    <div className="accept-decline-container">
                                        <div
                                            style={{ background: '#D93404' }}
                                            onClick={() => acceptDeclince(-1)}
                                        >
                                            Etiraz et
                                    </div>
                                        <div
                                            style={{ background: 'rgb(15, 157, 88)' }}
                                            onClick={() => acceptDeclince(1)}
                                        >
                                            Təsdiq et
                                    </div>
                                    </div>
                                </>
                                : <div
                                    style={{ background: '#D93404', color: 'white', padding: '6px', cursor: 'pointer', borderRadius: '3px' }}
                                    onClick={cancel}
                                >
                                    Sənədi Ləğv et
                            </div>
                        }
                    </>
                }
                <div className="toggle-participants" style={{ marginTop: "10px" }} onClick={handleParticipantsTransition}>
                    Tarixçəni göstər
                <FaAngleDown size="36" color="royalblue" />
                </div>
                {
                    participantsVisiblity &&
                    <div ref={participantsRef} className="visa-content-participants-show">
                        <ParticipantsUniversal fetchParticipants={props.fetchParticipants} />
                    </div>
                }
            </div>
        </div>
    )
}
export default BudgetIncRequestContent