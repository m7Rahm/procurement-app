import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import OrderContentProtected from './OrderContentProtected'
import Participants from '../../modal content/Participants'
import VisaContentFooter from './VisaContentFooter'
import EmptyContent from '../../Misc/EmptyContent'
import { FaAngleDown } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import Chat from '../../Misc/Chat'
import { TokenContext } from '../../../App'

const VisaContent = (props) => {
    const location = useLocation();
    const { tranid, documentType, initid } = props;
    const [visa, setVisa] = useState({ content: undefined, files: [] });
    const locationTranid = location.state ? location.state.tranid : undefined
    const inid = location.state ? location.state.initid : undefined
    const canProceed = useRef({});
    // console.log(visa)
    // const otherProcurementUsers = useRef([]);
    // const getOtherProcUsers = (abortController) => {
    //     fetch
    // }
    const fetchGet = useFetch("GET");
    const token = useContext(TokenContext)[0].token;
    const fetchMessages = useCallback((from = 0) =>
        fetchGet(`http://192.168.0.182:54321/api/messages/${tranid}?from=${from}&replyto=0&doctype=${documentType}`)
        , [tranid, fetchGet, documentType]);
    const sendMessage = useCallback(async data => {
        const formData = new FormData();
        formData.append("replyto", data.replyto);
        formData.append("docid", data.docid);
        formData.append("message", data.message);
        formData.append("docType", documentType);
        for (let i = 0; i < data.files.length; i++) {
            formData.append("files", data.files[i]);
        }
        const resp = await fetch(`http://192.168.0.182:54321/api/send-message`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })
        return await resp.json()
    }, [token, documentType]);
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (tranid && mounted && initid) {
            fetchGet(`http://192.168.0.182:54321/api/tran-info?tranid=${tranid}&init=${initid}`, abortController)
                .then(respJ => {
                    // console.log(respJ)
                    if (mounted)
                        if (respJ.length !== 0) {
                            canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                            setVisa({ content: respJ, files: (respJ[0].related_files || "").split(',').filter(file => file !== "") });
                        }
                        else setVisa({ content: undefined, files: [] })
                })
                .catch(error => console.log(error));
            return () => {
                mounted = false;
                abortController.abort()
            }
        }
    }, [tranid, fetchGet, initid]);
    useEffect(() => {
        const abortController = new AbortController();
        let mounted = true;
        if (locationTranid && mounted) {
            fetchGet(`http://192.168.0.182:54321/api/tran-info?tranid=${locationTranid}&init=${inid}`, abortController)
                .then(respJ => {
                    if (mounted)
                        if (respJ.length !== 0) {
                            canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                            setVisa({ content: respJ, files: respJ[0].related_files.split(',').filter(file => file !== "") });
                        }
                        else setVisa({ content: undefined, files: [] })
                })
                .catch(error => console.log(error));
            return () => {
                mounted = false;
                abortController.abort()
            }
        }
    }, [locationTranid, fetchGet, inid]);

    const participantsRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
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
        <div className="visa-content-container">
            {
                visa.content ?
                    <div>
                        <OrderContentProtected
                            footerComponent={VisaContentFooter}
                            setVisa={setVisa}
                            canProceed={canProceed}
                            current={visa.content}
                            files={visa.files}
                        />
                        <div style={{ margin: "10px 20px" }}>
                            <Chat
                                loadMessages={fetchMessages}
                                documentid={tranid}
                                documentType={documentType}
                                sendMessage={sendMessage}
                            />
                        </div>
                        <div className="toggle-participants" onClick={handleParticipantsTransition}>
                            Tarixçəni göstər
                        <FaAngleDown size="36" color="royalblue" />
                        </div>
                        {
                            participantsVisiblity &&
                            <div ref={participantsRef} className="visa-content-participants-show">
                                <Participants
                                    id={visa.content[0].order_id}
                                />
                            </div>
                        }
                    </div>
                    : <EmptyContent />
            }
        </div>
    )
}
export default VisaContent
