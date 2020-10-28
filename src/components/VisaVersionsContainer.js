import React, { useState, useEffect, useRef } from 'react'
import VisaContentMaterials from '../components/VisaContentMaterials'
import Participants from '../components/modal content/Participants'
import {
    FaAngleDown,
    FaCheck,
    FaTimes
} from 'react-icons/fa'
const VisaVersion = (props) => {
    const { version, token, closeModal, actionsAvailableRef, tranid } = props;
    const { emp_id, ord_numb, is_confirmed, conf_date, override } = version;
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
        fetch(`http://172.16.3.101:54321/api/accept-decline/${tranid}`,
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
                console.log(respJ);
                if (respJ[0].result === 'success')
                    closeModal()
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/get-order-req-data?numb=${ord_numb}&vers=${emp_id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setVisaContent(respJ))
            .catch(ex => console.log(ex))
    }, [ord_numb, emp_id, token]);

    const acceptEditedVersion = () => {
        if (visaContent[0].override) {
            const data = {
                ordNumb: ord_numb,
                empVersion: emp_id
            }
            fetch('http://172.16.3.101:54321/api/accept-edited-version', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ[0].result === 'success')
                        closeModal()
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
                                empVersion={emp_id}
                                number={ord_numb}
                            />
                        </div>
                    }
                </>
            }
        </div>
    )
}
const VisaVersionsContainer = (props) => {
    const { orderNumb, token, closeModal, tranid } = props;
    const [versions, setVersions] = useState([]);
    const actionsAvailableRef = useRef(true);
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/get-order-versions/${orderNumb}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                for (let i = 0; i < respJ.length; i++)
                    if (respJ[i].is_confirmed || respJ[i].result !== 0) {
                        actionsAvailableRef.current = false;
                        break;
                    }
                setVersions(respJ)
            })
    }, [token, orderNumb]);
    console.log(versions)
    return (
        <div>
            {
                versions.map(version =>
                    <VisaVersion
                        version={version}
                        token={token}
                        tranid={tranid}
                        key={version.id}
                        actionsAvailableRef={actionsAvailableRef}
                        closeModal={closeModal}
                    />
                )
            }
        </div>
    )
}
export default VisaVersionsContainer