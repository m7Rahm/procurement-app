import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import {
  IoMdClose,
} from 'react-icons/io'
import AlertBox from './modal content/AlertBox'
const modalContent = (Content) => ({ ...props }) =>
  <Content {...props} />
const Modal = (props) => {
  const closeModalCallback = useCallback(props.changeModalState, []);
  //todo: send ref to child and update every time needed
  //todo: onClose check if initial state changed
  const ModalContent = useMemo(() => modalContent(props.children), [props.children]);
  const stateRef = useRef({});
  const [alertVisible, setAlertVisible] = useState(false);
  const closeModal = () => {
    if (!stateRef.current.changed || props.token)
      closeModalCallback()
    else
      setAlertVisible(true)
  }
  useEffect(
    () => {
      const onEscPress = (e) => {
        if (e.keyCode === 27) {
          if (!stateRef.current.changed || props.token)
            closeModalCallback()
          else
            setAlertVisible(true)
        }
      }
      document.addEventListener('keyup', onEscPress, false);
      return () => document.removeEventListener('keyup', onEscPress, false)
    }, [closeModalCallback, props.token])
  return (
    <>
      <div className="modal" onClick={closeModal}>
      </div>
      <div className='modal-content wrapper'>
        <div style={{ marginBottom: '20px' }}>
          Sifariş № {props.number}
          <IoMdClose className="modal-close-button" onClick={closeModal} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
        </div>
        <ModalContent current={props.number} stateRef={stateRef} />
      </div>
      {
        alertVisible &&
        <AlertBox stateRef={stateRef} setAlertVisible={setAlertVisible} changeModalState={props.changeModalState} />
      }
    </>
  )
}
export default Modal