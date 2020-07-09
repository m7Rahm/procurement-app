import React, { useEffect, useCallback } from 'react'
import {
  IoMdClose
} from 'react-icons/io'
const modalContent = (Content) => ({ ...props }) =>
  <Content {...props} />
const Modal = (props) => {
  const closeModalCallback = useCallback(props.changeModalState, []);
  console.log(typeof props.content);
  const ModalContent = modalContent(props.children);
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
        <ModalContent />
      </div>
    </>
  )
}
export default Modal