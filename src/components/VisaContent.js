import React, { useRef, useState } from 'react'
import OrderContentProtected from '../components/OrderContentProtected'
import Participants from '../components/modal content/Participants'
import { orders } from '../data/data'
import {
    FaAngleDown,
} from 'react-icons/fa'
const VisaContent = (props) => {
    const participantsRef = useRef(null);
    const [participantsVisiblity, setParticipantsVisiblity] = useState(false);
    const order = orders.find(order => order.number === props.current);
    const handleParticipantsTransition = () => {
        if (participantsRef.current) {
            participantsRef.current.classList.toggle('visa-content-participants-hide');
            participantsRef.current.addEventListener('animationend', () => setParticipantsVisiblity(prev => !prev))
        }
        else
            setParticipantsVisiblity(prev => !prev);
    }
    return (
        <div style={{ flex: 1, background: 'transparent', height: '100vh', overflow: 'auto', paddingTop: '56px', textAlign: 'center' }}>
            <OrderContentProtected current={props.current} participantsRef={participantsRef} />
            <div className="toggle-participants" onClick={handleParticipantsTransition}>
                Tarixçəni göstər
                <FaAngleDown size="36" color="royalblue"/>
            </div>
            {
                participantsVisiblity &&
                <div ref={participantsRef} className="visa-content-participants-show">
                    <Participants participants={order.participants} number={props.current} />
                </div>
            }
        </div>
    )
}
export default VisaContent
