import React, { useEffect, useRef, useState } from "react"
import { FaInfo, FaCheck, FaTimes, FaAngleDown } from "react-icons/fa"
import DecomInventoryNumbers from "./DecomInventoryNumbers"
import ParticipantsUniversal from "../Common/ParticipantsUniversal"
import useFetch from "../../hooks/useFetch"
import ResultEmpty from "../Common/ResultEmpty"
const DecommissionContent = (props) => {
    const [decommissioned, setDecommissioned] = useState({ content: [], active: false });
    const [visible, setVisible] = useState({ visible: false, docid: null });
    const textareaRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
    const fetchDecommissionedContent = useFetch("GET");
    const fetchAcceptDecline = useFetch("POST");
    const participantsRef = useRef(null);
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (mounted && props.docid) {
            fetchDecommissionedContent("http://192.168.0.182:54321/api/decommisioned-doc-content?did=" + props.docid, abortController)
                .then(respJ => {
                    if (mounted && respJ.length) {
                        const active = respJ[0].user_result === 0 && respJ[0].doc_result === 2;
                        setDecommissioned({ content: respJ, active: active })
                    }
                })
                .catch(ex => console.log(ex))
        }
        return () => {
            abortController.abort();
            mounted = false;
        }
    }, [fetchDecommissionedContent, props.docid]);
    const closeModal = () => {
        setVisible({ visible: false })
    }
    const setDocid = (id) => {
        setVisible({ visible: true, docid: id })
    }
    const cancel = () => {

    }
    const acceptDeclince = (action) => {
        const data = {
            comment: textareaRef.current ? textareaRef.current.value : "",
            action,
            tranid: decommissioned.content[0].tran_id,
            docid: props.docid
        };
        fetchAcceptDecline("http://192.168.0.182:54321/api/accept-decline-decommission", data)
            .then(respJ => {
                if (respJ) {
                    setDecommissioned(prev => ({ ...prev, active: false, content: prev.content.map(material => ({ ...material, user_result: action })) }))
                    props.setInitData(prev => ({ ...prev }))
                }
            })
            .catch(ex => console.log(ex))
    }
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
    return (
        decommissioned.content.length && decommissioned.content[0].id !== null ?
            <>
                <div style={{ padding: "66px 10px 10px 0px", maxWidth: "1256px", minWidth: "1024px", margin: "0px auto" }}>
                    <DecomInventoryNumbers
                        docid={visible.docid}
                        visible={visible.visible}
                        closeModal={closeModal}
                    />
                    <div>
                        <h1>
                            {
                                !decommissioned.active &&
                                <div>
                                    {
                                        decommissioned.content[0].user_result === 1
                                            ? <FaCheck size="20" color="green" style={{ float: "left" }} />
                                            : <FaTimes size="20" color="red" style={{ float: "left" }} />
                                    }
                                    <h1 style={{ float: "right", fontSize: "20px", color: "goldenrod" }} >{decommissioned.content[0].user_action_date_time}</h1>
                                </div>
                            }
                        </h1>
                    </div>
                    <table className="new-budget users-table" style={{ width: "100%", marginTop: "56px" }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Məhsul</th>
                                <th>Barkod</th>
                                <th>Miqdar</th>
                                <th>Qiymət</th>
                                <th>Ümumi qiymət</th>
                                <th>Hücrə №</th>
                                <th>Yararlıq müddəti</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                decommissioned.content.map((row, index) =>
                                    <tr key={row.id}>
                                        <td>{index + 1}</td>
                                        <td>{row.product_title}</td>
                                        <td>{row.barcode}</td>
                                        <td>{row.quantity}</td>
                                        <td>{row.price_for_one}</td>
                                        <td>{row.sum_price}</td>
                                        <td>{row.product_cell}</td>
                                        <td>{row.exp_date}</td>
                                        <td><FaInfo onClick={() => setDocid(row.document_id)} /></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        decommissioned.active &&
                        <>
                            {
                                decommissioned.content[0].tran_id
                                    ? <div>
                                        <textarea
                                            ref={textareaRef} placeholder="Qeydlərinizi daxil edin.."
                                            style={{ width: '82%', minHeight: '100px', margin: "auto", marginTop: "20px", display: "block" }}
                                        />
                                        <div className="accept-decline-container">
                                            <div
                                                style={{
                                                    background: '#D93404',
                                                    textAlign: "center"
                                                }}
                                                onClick={() => acceptDeclince(-1)}
                                            >
                                                Etiraz et
                                    </div>
                                            <div
                                                style={{
                                                    background: 'rgb(15, 157, 88)',
                                                    textAlign: "center"
                                                }}
                                                onClick={() => acceptDeclince(1)}
                                            >
                                                Təsdiq et
                                    </div>
                                        </div>
                                    </div>
                                    : <div
                                        style={{
                                            background: '#D93404',
                                            color: 'white',
                                            padding: '6px',
                                            cursor: 'pointer',
                                            borderRadius: '3px',
                                            textAlign: "center"
                                        }}
                                        onClick={cancel}
                                    >
                                        Sənədi Ləğv et
                            </div>
                            }
                        </>
                    }
                    <div className="toggle-participants" style={{ marginTop: "20px" }} onClick={handleParticipantsTransition}>
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
            </>
            : <div style={{ paddingTop: "56px", flex: 1 }}>
                <ResultEmpty />
            </div>
    )
}
export default DecommissionContent