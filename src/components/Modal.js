import React, { useEffect, useCallback } from 'react'

export default (props) => {
  const closeModalCallback = useCallback(props.changeModalState, [])
  useEffect(
    () => {
      const onEscPress = (e) => {
        if (e.keyCode === 27)
        {
        closeModalCallback()
        }
      }
      document.addEventListener('keyup', onEscPress, false);
      console.log('use effect fired')
      return () => document.removeEventListener('keyup', onEscPress, false)
    }, [closeModalCallback])
  return (
    <>
      <div className="modal" onClick={() => closeModalCallback()}>
      </div>
      {
        props.content
      }
    </>
  )
}