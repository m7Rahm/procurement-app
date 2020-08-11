import React, { useRef, useState } from 'react'
import OrderContentProtected from '../components/OrderContentProtected'
import Participants from '../components/modal content/Participants'
import {
    FaAngleDown,
} from 'react-icons/fa'

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
        <div className="visa-content-container">
            <div>
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
                                    <Participants number={props.current[0].ord_numb} />
                                </div>
                            }
                        </>
                        : <>
                            <div style={{ marginTop: '100px' }}>
                                <img
                                    src={require('../Konvert.svg')}
                                    alt="blah"
                                    height="70"
                                    style={{ marginBottom: '20px' }} />
                                <br />
                                <span style={{ color: 'gray', fontSize: 20 }}>Baxmaq üçün sənədi seçin</span>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}
export default VisaContent