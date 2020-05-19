import React, { useEffect, useCallback } from 'react'

export default (props) => {
    const closeModal = props.changeModalState
    const onEscPress = useCallback((e) => {
        if (e.keyCode === 27)
        closeModal(false)
    },
    [closeModal])
    useEffect(
        () => {
            document.addEventListener('keyup', onEscPress, false)
            return () => document.removeEventListener('keyup', onEscPress, false)
        }, [onEscPress])
    return (
        <>
            <div className="modal" onClick={() => closeModal(false)}>
            </div>
            {
                props.content
            }
        </>
    )
}