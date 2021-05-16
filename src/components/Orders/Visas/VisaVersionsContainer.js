import React, { useState, useEffect, useRef } from 'react'
import VisaContentMaterials from '../../Common/VisaContentMaterials'
import Participants from '../../modal content/Participants'
import {
    FaAngleDown,
    FaCheck,
    FaTimes
} from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch'

const VisaVersionsContainer = (props) => {
    const { orderNumb, doneEditing, tranid } = props;
    const [versions, setVersions] = useState([]);
    const actionsAvailableRef = useRef(true);
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/get-order-versions/${orderNumb}`)
            .then(respJ => {
                for (let i = 0; i < respJ.length; i++)
                    if (respJ[i].is_confirmed || respJ[i].result !== 0) {
                        actionsAvailableRef.current = false;
                        break;
                    }
                setVersions(respJ)
            })
    }, [fetchGet, orderNumb]);
    return (
        <div>
            {
                versions.map(version =>
                    <VisaVersion
                        version={version}
                        fetchPost={fetchPost}
                        fetchGet={fetchGet}
                        tranid={tranid}
                        key={version.id}
                        actionsAvailableRef={actionsAvailableRef}
                        closeModal={doneEditing}
                    />
                )
            }
        </div>
    )
}
const VisaVersion = (props) => {
    const { version, fetchPost, closeModal, actionsAvailableRef, tranid, fetchGet } = props;
    const { emp_id, ord_numb, is_confirmed, conf_date, override, id } = version;
    const [visaContent, setVisaContent] = useState([]);
    const participantsRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
    const handleParticipantsTransition = () => {
        if (participantsRef.current) {
            participantsRef.current.classList.toggle('visa-content-participants-hide');
            participantsRef.current.addEventListener('animationend', () => setParticipantsVisiblity(prev => !prev))
        }
        else
            setParticipantsVisiblity(prev => !prev);
    }
    const handleClick = (action) => {
        const data = {
            action: action,
            comment: '',
        }
        fetchPost(`http://192.168.0.182:54321/api/accept-decline/${tranid}`, data)
            .then(respJ => {
                if (respJ[0].operation_result === 'success') {
                    closeModal({ act_date_time: respJ[0].act_date_time }, [], respJ[0].origin_emp_id)
                }
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/order-req-data?numb=${ord_numb}&vers=${emp_id}`)
            .then(respJ => setVisaContent(respJ))
            .catch(ex => console.log(ex))
    }, [ord_numb, emp_id, fetchGet]);

    const acceptEditedVersion = () => {
        if (visaContent[0].override) {
            const data = {
                orderid: id
            }
            fetchPost('http://192.168.0.182:54321/api/accept-edited-version', data)
                .then(respJ => {
                    if (respJ[0].operation_result === 'success') {
                        closeModal({ act_date_time: respJ[0].act_date_time }, [], respJ[0].origin_emp_id)
                    }
                })
        }
    }
    return (
        <div style={{ padding: '20px 0px', overflow: 'hidden' }}>
            {
                visaContent.length !== 0 &&
                <>
                    {
                        !actionsAvailableRef.current &&
                        <div className="protex-order-header-container">
                            {
                                is_confirmed
                                    ? <span>
                                        {conf_date}
                                        <FaCheck size="30" title="Təsdiq" color="#34A853" />
                                    </span>
                                    : <span>
                                        {conf_date}
                                        <FaTimes title="Etiraz" size="30" color="#EA4335" />
                                    </span>
                            }
                        </div>
                    }
                    <VisaContentMaterials
                        orderContent={visaContent}
                        forwardType={1}
                    />
                    {
                        actionsAvailableRef.current &&
                        <div className="accept-decline-container">
                            {
                                !override &&
                                <div style={{ backgroundColor: 'rgb(217, 52, 4)' }} onClick={() => handleClick(-1)}>
                                    Etiraz et
                            </div>
                            }
                            <div style={{ backgroundColor: 'rgb(15, 157, 88)' }} onClick={override ? acceptEditedVersion : () => handleClick(1)}>
                                Təsdiq et
                            </div>
                            {
                                !override &&
                                <div style={{ backgroundColor: 'rgb(244, 180, 0)' }} onClick={() => handleClick(2)}>
                                    Redaktəyə qaytar
                            </div>
                            }
                        </div>
                    }
                    <div className="toggle-participants" onClick={handleParticipantsTransition}>
                        Tarixçəni göstər
                            <FaAngleDown size="36" color="royalblue" />
                    </div>
                    {
                        participantsVisiblity &&
                        <div ref={participantsRef} className="visa-content-participants-show">
                            <Participants
                                id={id}
                            />
                        </div>
                    }
                </>
            }
        </div>
    )
}
export default VisaVersionsContainer