import React, { useEffect, useCallback } from 'react'
import {
  IoMdClose
} from 'react-icons/io'
export default (props) => {
  const closeModalCallback = useCallback(props.changeModalState, [])
  useEffect(
    () => {
      const onEscPress = (e) => {
        if (e.keyCode === 27) {
          closeModalCallback()
        }
      }
      document.addEventListener('keyup', onEscPress, false);
      return () => document.removeEventListener('keyup', onEscPress, false)
    }, [closeModalCallback])
  return (
    <>
      <div className="modal" onClick={closeModalCallback}>
      </div>
        <div className='modal-content wrapper'>
          <div style={{ marginBottom: '20px' }}>
            Sifariş № {props.number}
            <IoMdClose className="modal-close-button" onClick={closeModalCallback} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
          </div>
          {
            props.children
          }
        </div>
    </>
  )
}