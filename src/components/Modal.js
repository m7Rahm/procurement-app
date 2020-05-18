import React, { useEffect } from 'react'

export default (props) => {
    const onmModalClick = () => {
        props.changeModalState(false)
    }
    const onEscPress = (e) => {
        if (e.keyCode===27)
        onmModalClick()
    }
    useEffect(
        () => {
            document.addEventListener('keyup', onEscPress , false)
            return ()=> document.removeEventListener('keyup', onEscPress , false)
        },[])
    return (
        <div className="modal" onClick={onmModalClick}>
            {
                props.children
            }
        </div>
    )
}