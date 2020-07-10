import React, { useEffect, useCallback, useState, useRef } from 'react'
import {
  IoMdClose
} from 'react-icons/io'
const modalContent = (Content) => ({ ...props }) =>
<Content {...props} />
const Modal = (props) => {
  const closeModalCallback = useCallback(props.changeModalState, []);
  const ModalContent = modalContent(props.children);
  //todo: send ref to child and update every time needed
  const stateRef = useRef(null);
  //todo: onClose check if initial state changeed
  const [isCloseAvailable, setIsCloseAvailable] = useState(true);
  useEffect(
    () => {
      const onEscPress = (e) => {
        if (e.keyCode === 27 && isCloseAvailable) {
          closeModalCallback()
        }
      }
      document.addEventListener('keyup', onEscPress, false);
      return () => document.removeEventListener('keyup', onEscPress, false)
    }, [closeModalCallback, isCloseAvailable])
  return (
    <>
      <div className="modal" onClick={closeModalCallback}>
      </div>
      <div className='modal-content wrapper'>
        <div style={{ marginBottom: '20px' }}>
          Sifariş № {props.number}
          <IoMdClose className="modal-close-button" onClick={() => {if (isCloseAvailable) closeModalCallback()}} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
        </div>
        <ModalContent setIsCloseAvailable={setIsCloseAvailable} stateRef={stateRef} />
      </div>
    </>
  )
}
export default Modal