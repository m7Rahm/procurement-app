import React, { useEffect, useRef, useMemo } from 'react'
import {
  IoMdClose,
} from 'react-icons/io'

const modalContent = (Content) => ({ ...props }) =>
  <Content {...props} />

const Modal = (props) => {
  const { style, canBeClosed = true, number, title, changeModalState } = props;
  const modalWrapperRef = useRef(null)
  const ModalContent = useMemo(() => modalContent(props.children), [props.children]);
  const stateRef = useRef({});
  const closeModal = () => {
    if (!stateRef.current.changed || canBeClosed)
      changeModalState()
  }
  useEffect(() => {
    const onEscPress = (e) => {
      if (e.keyCode === 27) {
        if (!stateRef.current.changed || canBeClosed)
          changeModalState()
      }
    }
    document.addEventListener('keyup', onEscPress, false);
    return () => document.removeEventListener('keyup', onEscPress, false)
  }, [changeModalState, canBeClosed]);
  return (
    <>
      <div className="modal" onClick={closeModal}></div>
      <div ref={modalWrapperRef} className='modal-content wrapper' style={style}>
        <div style={{ marginBottom: '20px' }}>
          {title || ""} {number}
          <IoMdClose className="modal-close-button" onClick={closeModal} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
        </div>
        <ModalContent
          closeModal={changeModalState}
          modalWrapperRef={modalWrapperRef}
          current={number}
          stateRef={stateRef}
          {...props.childProps}
        />
      </div>
    </>
  )
}
export default Modal