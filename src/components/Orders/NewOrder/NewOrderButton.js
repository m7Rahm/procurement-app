import React, { useContext, useState } from 'react'
import { Suspense } from 'react'
import {
  MdAdd
} from 'react-icons/md'
import { WebSocketContext } from '../../../pages/SelectModule'
import Modal from '../../Misc/Modal'
const NewOrderContent = React.lazy(() => import('../../modal content/NewOrder'))
const NewOrder = (props) => {
  const webSocket = useContext(WebSocketContext)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClick = (action) => {
    setIsModalVisible(_ => action);
  };
  const handleClose = (data, receivers) => {
    // todo: send notif on new order to receivers
    setIsModalVisible(_ => false);
    const message = {
      message: "notification",
      receivers: receivers.map(receiver => ({ id: receiver, notif: "newOrder" })),
      data: undefined
    }
    webSocket.send(JSON.stringify(message))
    props.setOrders({ count: data[0].total_count, orders: data });
  };
  return (
    <>
      <div title="yeni sifariş" className="new-order-button" onClick={() => handleClick(true)}>
        <MdAdd color="white" size="30" />
      </div>
      {
        isModalVisible &&
        <Suspense fallback="">
          <Modal title="Yeni Sifariş" changeModalState={() => handleClick(false)} wrapperRef={props.wrapperRef}>
            {(props) => <NewOrderContent handleModalClose={handleClose} {...props} />}
          </Modal>
        </Suspense>
      }
    </>
  )
}
export default NewOrder