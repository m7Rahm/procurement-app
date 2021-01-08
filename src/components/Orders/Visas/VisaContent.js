import React, { useRef, useState, useEffect, useContext } from 'react'
import OrderContentProtected from './OrderContentProtected'
import Participants from '../../modal content/Participants'
import VisaContentFooter from './VisaContentFooter'
import EmptyContent from '../../Misc/EmptyContent'
import { TokenContext } from '../../../App'
import {
    FaAngleDown,
} from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

const VisaContent = (props) => {
    const location = useLocation();
    const { tranid } = props;
    const tokenContext = useContext(TokenContext);
    const { sendNotification } = props;
    const [visa, setVisa] = useState(undefined);
    const token = tokenContext[0].token;
    const canProceed = useRef({});
    useEffect(() => {
        const stateTranId = location.state ? location.state.tranid : undefined;
        const id = tranid ? tranid : stateTranId;
        if (id)
            fetch(`http://172.16.3.101:54321/api/tran-info?tranid=${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length !== 0) {
                        canProceed.current = respJ.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
                        setVisa(() => respJ);
                    }
                })
                .catch(error => console.log(error));
    }, [tranid, token, location])
    const participantsRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
    const handleParticipantsTransition = () => {
        if (participantsRef.current) {
            participantsRef.current.classList.toggle('visa-content-participants-hide');
            participantsRef.current.addEventListener('animationend', () => {
                if(participantsRef.current)
                    setParticipantsVisiblity(prev => !prev)
            })
        }
        else
            setParticipantsVisiblity(prev => !prev);
    }
    return (
        <div className="visa-content-container">
            {
                visa ?
                    <div>
                        <OrderContentProtected
                            sendNotification={sendNotification}
                            footerComponent={VisaContentFooter}
                            setVisa={setVisa}
                            canProceed={canProceed}
                            current={visa}
                        />
                        <div className="toggle-participants" onClick={handleParticipantsTransition}>
                            Tarixçəni göstər
                        <FaAngleDown size="36" color="royalblue" />
                        </div>
                        {
                            participantsVisiblity &&
                            <div ref={participantsRef} className="visa-content-participants-show">
                                <Participants
                                    empVersion={visa[0].emp_version_id}
                                    number={visa[0].ord_numb}
                                />
                            </div>
                        }
                    </div>
                    : <EmptyContent/>
            }
        </div>
    )
}
export default VisaContent
