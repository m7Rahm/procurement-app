import React, { useContext, useState } from 'react'
import { Suspense } from 'react'
import {
  MdAdd
} from 'react-icons/md'
import { TokenContext } from '../../../App'
import useFetch from '../../../hooks/useFetch'
import { WebSocketContext } from '../../../pages/SelectModule'
import Loading from '../../Misc/Loading'
import Modal from '../../Misc/Modal'
import OperationResultLite from "../../Misc/OperationResultLite"
const NewOrderContent = React.lazy(() => import('../../modal content/NewOrder'))
const NewOrder = (props) => {
  const webSocket = useContext(WebSocketContext)
  const tokenContext = useContext(TokenContext);
  const userData = tokenContext[0].userData;
  const canSeeOtherOrders = userData.previliges.includes("Digər sifarişləri görmək")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const fetchPost = useFetch("POST");
  const closeModal = async (receivers) => {
    setIsModalVisible(false);
    if (receivers) {
      const message = {
        message: "notification",
        receivers: receivers.map(receiver => ({ id: receiver, notif: "newOrder" })),
        data: undefined
      }
      const apiData = {
        from: 0,
        until: 20,
        status: -3,
        dateFrom: '',
        dateTill: '',
        ordNumb: '',
        canSeeOtherOrders: canSeeOtherOrders
      };
      //todo: create socket and connect
      fetchPost('http://192.168.0.182:54321/api/orders', apiData)
        .then(respJ => {
          props.setOrders({ count: respJ[0].total_count, orders: respJ });
        })
        .catch(err => console.log(err))
      webSocket.send(JSON.stringify(message));
    }
  };
  return (
    <>
      <div title="yeni sifariş" className="new-order-button" onClick={() => setIsModalVisible(true)}>
        <MdAdd color="white" size="30" />
      </div>
      {
        <OperationResultLite
          setState={setSending}
          state={sending}
          text="Sifariş göndərilir..."
        />
      }
      {
        isModalVisible &&
        <Suspense fallback={<Loading />}>
          <Modal
            title="Yeni Sifariş"
            childProps={{ closeModal: closeModal, setSending: setSending, token: tokenContext[0].token }}
            changeModalState={() => setIsModalVisible()}
            wrapperRef={props.wrapperRef}
          >
            {NewOrderContent}
          </Modal>
        </Suspense>
      }
    </>
  )
}
export default NewOrder