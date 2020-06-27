import React, { useState, Suspense } from 'react'
import {
  MdAdd
} from 'react-icons/md'
import Modal from './Modal'
const NewOrderContent = React.lazy(() => import('./modal content/NewOrder'))
const NewOrder = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClick = (action) => {
    const blurVal = isModalVisible ? 'none' : 'blur(6px)';
    props.wrapperRef.current.style.filter = blurVal;
    setIsModalVisible(_ => action);
  }
  return (
    <>
      <div className="new-order-button" onClick={() => handleClick(true)}>
        <MdAdd color="white" size="30" />
      </div>
      {
        isModalVisible &&
        <Modal changeModalState={() => handleClick(false)} wrapperRef={props.wrapperRef}>
          <Suspense fallback="loading..">
            <NewOrderContent />
          </Suspense>
        </Modal>
      }
    </>
  )
}
export default NewOrder