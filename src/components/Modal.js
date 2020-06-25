import React, { useEffect, useCallback } from 'react'

export default (props) => {
  const closeModal = props.changeModalState
  const closeModalCallback = useCallback(closeModal, [])
  const wrapperRef = props.wrapperRef.current
  useEffect(
    () => {
      const onEscPress = (e) => {
        if (e.keyCode === 27)
        {
        wrapperRef.style.filter = "";
        closeModalCallback(false)
        }
      }
      document.addEventListener('keyup', onEscPress, false);
      console.log('use effect fired')
      return () => document.removeEventListener('keyup', onEscPress, false)
    }, [closeModalCallback, wrapperRef])
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