import React, { useEffect, useCallback, useRef, useMemo } from 'react'
import {
  IoMdClose,
} from 'react-icons/io'

const modalContent = (Content) => ({ ...props }) =>
  <Content {...props} />

const Modal = (props) => {
  const closeModalCallback = useCallback(props.changeModalState, []);
  const width = props.width;
  const canBeClosed = props.canBeClosed;
  const number = props.number;
  const title = props.title
  //todo: send ref to child and update every time needed
  //todo: onClose check if initial state changed
  const modalWrapperRef = useRef(null)
  const ModalContent = useMemo(() => modalContent(props.children), [props.children]);
  const stateRef = useRef({});
  const closeModal = () => {
    if (!stateRef.current.changed || canBeClosed)
      closeModalCallback()
  }
  useEffect(
    () => {
      const onEscPress = (e) => {
        if (e.keyCode === 27) {
          if (!stateRef.current.changed || canBeClosed)
            closeModalCallback()
        }
      }
      document.addEventListener('keyup', onEscPress, false);
      return () => document.removeEventListener('keyup', onEscPress, false)
    }, [closeModalCallback, canBeClosed])
  return (
    <>
      <div className="modal" onClick={closeModal}>
      </div>
      <div ref={modalWrapperRef} style={{ width: width }} className='modal-content wrapper'>
        <div style={{ marginBottom: '20px' }}>
          {title || ' Sifariş №'} {number}
          <IoMdClose className="modal-close-button" onClick={closeModal} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
        </div>
        <ModalContent closeModal={closeModalCallback} modalWrapperRef={modalWrapperRef} current={number} stateRef={stateRef} />
      </div>
    </>
  )
}
export default Modal