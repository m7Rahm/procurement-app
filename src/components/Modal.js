import React, { useEffect, useCallback } from 'react'

export default (props) => {
    const closeModel = props.changeModalState
    const onEscPress = useCallback((e) => {
        if (e.keyCode === 27)
        closeModel(false)
    },
    [closeModel])
    useEffect(
        () => {
            document.addEventListener('keyup', onEscPress, false)
            return () => document.removeEventListener('keyup', onEscPress, false)
        }, [onEscPress])
    return (
        <>
            <div className="modal" onClick={() => closeModel(false)}>
            </div>
            {
                props.content
            }
        </>
    )
}