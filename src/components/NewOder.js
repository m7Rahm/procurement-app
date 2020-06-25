import React, { useState } from 'react'
import {
  MdAdd
} from 'react-icons/md'
import Modal from './Modal'
const NewOrder = (props) => {
  const [isNewOrderVisible, setIsNewOrderVisible] = useState(false);
  const handleClick = () => {
    setIsNewOrderVisible(prev => !prev);
    props.wrapperRef.current.style.filter="blur(6px)"
  }
  const handleClose = () => {
    setIsNewOrderVisible(prev => !prev);
    props.wrapperRef.current.style.filter="none"
  }
  return (
    <>
    <div className="new-order" onClick={handleClick}>
    <MdAdd color="white" size="30"/>
    </div>
    {
      isNewOrderVisible && <Modal changeModalState={handleClose} wrapperRef={props.wrapperRef}/>
    }
    </>
  )
}
export default NewOrder