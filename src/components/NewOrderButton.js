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
  const handleClose = (data, receivers) => {
    setIsModalVisible(_ => false);
    // todo: send notif on new order to receivers
    console.log(receivers);
    props.webSocketRef.current.send(JSON.stringify({action: 'newOrder', people: receivers}));
    console.log(receivers)
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
              <NewOrderContent closeModal={handleClose} {...props} />
            </Suspense>
          }
        </Modal>
      }
    </>
  )
}
export default NewOrder