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
    if ((!stateRef.current.changed || canBeClosed))
      changeModalState()
  }
  const handleDragStart = (e) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
    document.onmouseup = endDrag;
    document.onmousemove = handleDragModal;
  }
  const handleDragModal = (e) => {
    e.preventDefault();
    modalWrapperRef.current.style.top = `${modalWrapperRef.current.offsetTop - mousePositionRef.current.y + e.clientY}px`
    modalWrapperRef.current.style.left = `${modalWrapperRef.current.offsetLeft - mousePositionRef.current.x + e.clientX}px`
    mousePositionRef.current.x = e.clientX;
    mousePositionRef.current.y = e.clientY;
  }
  const endDrag = (e) => {
    e.preventDefault();
    document.onmousemove = null;
    document.onmouseup = null;
  }
  const mousePositionRef = useRef({ x: null, y: null });
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
    <div style={{ position: "fixed", zIndex: "2", top: 0, right: 0, left: 0, bottom: 0, overflow: "auto" }}>
      <div className="modal" onClick={closeModal}></div>
      <div ref={modalWrapperRef} className='modal-content wrapper' style={style}>
        <div style={{ marginBottom: '20px' }} onMouseDown={handleDragStart}>
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
    </div>
  )
}
export default Modal