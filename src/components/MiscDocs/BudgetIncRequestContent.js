import React, { useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '../../App';
import { months } from '../../data/data'
import ParticipantsUniversal from '../Common/ParticipantsUniversal'
import { FaAngleDown, FaCheck, FaTimes } from 'react-icons/fa'
const BudgetIncRequestContent = (props) => {
    const { tranid, docid, docType } = props;
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [docState, setDocState] = useState({ content: [], active: false });
    const comment = docState.content.length !== 0 ? docState.content[0].comment : "";
    const textareaRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
    const participantsRef = useRef(null);
    let result = undefined;
    let time = undefined;
    if (docState.content.length && docState.content[0].user_result !== 0 && tranid) {
        result = docState.content[0].user_result === 1 ? true : false;
        time = docState.content[0].action_date_time;
    } else if (docState.content.length && docState.content[0].doc_result !== 0 && !tranid) {
        result = docState.content[0].doc_result === 1 ? true : false;
        time = docState.content[0].doc_action_date_time;
    }
    const fetchParticipants = () => {
        return fetch(`http://192.168.0.182:54321/api/misc-doc-participants?docid=${docid}&docType=${docType}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    }
    useEffect(() => {
        const abortController = new AbortController();
        if (docid) {
            fetch(`http://192.168.0.182:54321/api/misc-doc-content?docid=${docid}&docType=${docType}${tranid ? "&tranid=" + tranid : ""}`, {
                signal: abortController.signal,
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(resp => resp.ok ? resp.json() : new Error("Interval Server Error"))
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setDocState({ content: respJ, active: respJ[0].doc_result === 0 && !respJ[0].user_result })
                        if (textareaRef.current)
                            textareaRef.current.value = respJ[0].review
                    }
                })
                .catch(ex => console.log(ex))
        }
    }, [token, tranid, docid, docType]);
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
        const data = JSON.stringify({
            action: action,
            tranid: tranid,
            docid: docid,
            comment: textareaRef.current.value
        })
        fetch("http://192.168.0.182:54321/api/accept-budget-inc-req", {
            signal: abortController.signal,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": data.length,
                "Authorization": "Bearer " + token
            },
            body: data
        })
            .then(resp => resp.ok ? resp.json() : new Error("Internal Server Error"))
            .then(respJ => {
                if (respJ.length !== 0) {
                    setDocState(prev => ({ content: prev.content.map(row => ({ ...row, user_result: action })), active: false }))
                }
            })
            .catch(ex => console.log(ex))
    }
    const cancel = () => {

    }
    return (
        <div className="visa-content-container">
            <div style={{ maxWidth: "1024px", margin: "auto" }}>
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
                            props.tranid
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
                        <ParticipantsUniversal fetchParticipants={fetchParticipants} />
                    </div>
                }
            </div>
        </div>
    )
}
export default BudgetIncRequestContent