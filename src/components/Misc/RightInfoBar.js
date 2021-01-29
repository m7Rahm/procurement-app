import React, { useRef, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
const RightInfoBar = (props) => {
    const ref = useRef(null);
    const setRightBarState = props.setRightBarState
    useEffect(() => {
        ref.current.addEventListener('animationend', () => {
            if (ref.current.classList.contains("right-bar-close")){
                setRightBarState(prev => ({ ...prev, visible: false }))
            }
        })
    }, [setRightBarState])
    const closeBar = () => {
        ref.current.classList.toggle("right-bar-close")
    }
    return (
        <div className="right-bar" ref={ref}>
            <span style={{ display: 'inline-block', float: 'left', margin: '5px', cursor: 'pointer' }}>
                <FaTimes size="30" onClick={closeBar}/>
            </span>
            {props.children}
        </div>
    )
}

export default RightInfoBar