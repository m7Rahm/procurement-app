import React, { useState, Suspense } from 'react'
import {
  MdAdd
} from 'react-icons/md'
import Modal from './Modal'
const NewOrderContent = React.lazy(() => import('./modal content/NewOrder'))
const NewOrder = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClick = (action) => {
    setIsModalVisible(_ => action);
  };
  // const setOrdersCallback = useCallback(props.setOrders,[]);
  const handleClose = (data) => {
    setIsModalVisible(_ => false);
    // todo: send notif on new order to receivers
    //props.webSocketRef.current.send(JSON.stringify(data.receivers)) 
    props.setOrders(data);
  };
  return (
    <>
      <div title="yeni sifariş" className="new-order-button" onClick={() => handleClick(true)}>
        <MdAdd color="white" size="30" />
      </div>
      {
        isModalVisible &&
        <Modal changeModalState={() => handleClick(false)} wrapperRef={props.wrapperRef}>
          {
            (props) => <Suspense fallback="loading..">
              <NewOrderContent closeModal={handleClose} current={-1} {...props} />
            </Suspense>
          }
        </Modal>
      }
    </>
  )
}
export default NewOrder