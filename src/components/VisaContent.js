import React, { useRef, useState } from 'react'
import OrderContentProtected from '../components/OrderContentProtected'
import Participants from '../components/modal content/Participants'
import {
    FaAngleDown,
} from 'react-icons/fa'
import {
    IoIosInformationCircleOutline
} from 'react-icons/io'
const VisaContent = (props) => {
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
    return (
        <div style={{ flex: 1, background: 'transparent', height: '100vh', overflow: 'auto', paddingTop: '56px', textAlign: 'center' }}>
            {
                props.current
                    ? <>
                        <OrderContentProtected current={props.current} />
                        <div className="toggle-participants" onClick={handleParticipantsTransition}>
                            Tarixçəni göstər
                            <FaAngleDown size="36" color="royalblue" />
                        </div>
                        {
                            participantsVisiblity &&
                            <div ref={participantsRef} className="visa-content-participants-show">
                                <Participants number={props.current.number} />
                            </div>
                        }
                    </>
                    : <>
                        <div style={{ marginTop: '100px' }}>
                            <IoIosInformationCircleOutline size="170" color="skyblue" />
                            <br />
                            <span style={{color: 'gray', fontSize: 20}}>Baxmaq üçün sənədi seçin</span>
                        </div>
                    </>
            }
        </div>
    )
}
export default VisaContent
