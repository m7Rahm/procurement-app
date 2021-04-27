import React, { lazy, useState, useContext, useCallback } from "react"
import { FaBoxOpen, FaBox } from "react-icons/fa"
import {
  IoMdCheckmark,
  IoMdClose,
  IoMdPaperPlane,
  IoMdDoneAll,
  IoMdPeople,
  IoMdMore,
  IoMdChatbubbles
} from "react-icons/io"
import EditOrderRequest from "../../modal content/EditOrderRequest"
import { TokenContext } from "../../../App"
import { WebSocketContext } from "../../../pages/SelectModule"
import useFetch from "../../../hooks/useFetch"
import { Suspense } from "react"
import Chat from "../../Misc/Chat"
const FinishOrder = lazy(() => import("../../modal content/FinishOrder"))
const ParticipantsModal = lazy(() => import("../../modal content/Participants"))
const StatusModal = lazy(() => import("../../modal content/Status"))
const Modal = lazy(() => import("../../Misc/Modal"))
const Hybrid = (props) => <>
  <StatusModal id={props.id} />
  <ParticipantsModal id={props.id} />
</>
const OrderContentWithChat = (props) => {
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")
  const fetchMessages = useCallback((from = 0) =>
    fetchGet(`http://192.168.0.182:54321/api/messages/${props.id}?from=${from}&replyto=0&doctype=${10}`)
    , [props.id, fetchGet]);
  const sendMessage = useCallback((data) => {
    const apiData = { ...data, docType: 10 };
    return fetchPost(`http://192.168.0.182:54321/api/send-message`, apiData)
  }, [fetchPost]);
  return (
    <>
      <EditOrderRequest {...props} />
      <div style={{ padding: "0px 20px " }}>
        <Chat
          loadMessages={fetchMessages}
          documentid={props.id}
          documentType={10}
          sendMessage={sendMessage}
        />
      </div>
    </>
  )
}
const ListItem = (props) => {
  const tokenContext = useContext(TokenContext);
  const webSocket = useContext(WebSocketContext);
  const token = tokenContext[0].token;
  const { referer, setOrders, status, participants, date, id, number, empid } = props;
  const [modalState, setModalState] = useState({ visible: false, content: null, childProps: {}, title: "Sifariş №" });

  const handleClose = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  }
  const onParticipantsClick = () => {
    const childProps = { id }
    setModalState(prev => ({ ...prev, visible: true, content: Hybrid, childProps: childProps, number: number }))
  }
  const handleFinishClick = () => {
    const childProps = {
      token: token,
      id,
      version: empid,
      ordNumb: number,
      status: status,
      setOrders: setOrders
    }
    setModalState(prev => ({ ...prev, visible: true, content: FinishOrder, childProps: childProps, number: number }))
  }
  const fetchPost = useFetch("POST");
  const onInfoClick = () => {
    const onSendClick = (data, setOperationResult) => {
      const reqData = data;
      fetchPost("http://192.168.0.182:54321/api/new-order", reqData)
        .then(respJ => {
          if (respJ[0].result === "success") {
            const message = {
              message: "notification",
              receivers: respJ
                .filter(receiver => receiver.receiver_id)
                .map(receiver => ({ id: receiver.receiver_id, notif: "newOrder" })),
              data: undefined
            }
            webSocket.send(JSON.stringify(message))
            setOrders(prev => {
              const newList = prev.orders.filter(order => order.id !== id);
              setModalState(prev => ({ ...prev, visible: false }))
              return ({ orders: newList, count: newList.count })
            });
          }
          else if (respJ[0].error)
            setOperationResult({ visible: true, desc: respJ[0].error })
          else
            throw new Error("Error Performing operation")
        })
    }
    const childProps = {
      version: empid,
      ordNumb: number,
      view: referer,
      id: id,
      onSendClick
    }
    setModalState(prev => ({ ...prev, visible: true, content: OrderContentWithChat, childProps, number: number }))
  }
  const icon = status === 0
    ? <IoMdCheckmark color="#F4B400" title="Baxılır" size="20" />
    : status === 99
      ? <IoMdDoneAll color="#0F9D58" title="Tamamlanmışdır" size="20" />
      : status === -1
        ? <IoMdClose color="#DB4437" title="Etiraz" size="20" />
        : status === 77
          ? <IoMdPaperPlane color="#4285F4" title="Gözlənilir" size="20" />
          : status === 20
            ? <FaBoxOpen title="Anbardan göndərildi" size="20" color="#aaaaaa" />
            : status === 1
              ? <IoMdCheckmark color="#0F9D58" title="Təsdiq" size="20" />
              : status === 25 || status === 44
                ? <FaBox color="#aaaaaa" title="Anbara daxil oldu" size="20"/>
                : ""
  return (
    <>
      <li style={{ justifyContent: "space-between" }}>
        <div style={{ width: "30px", fontWeight: "520", color: "#505050", textAlign: "center" }}>{props.index + 1}</div>
        <div style={{ width: "80px", textAlign: "center" }}>
          {icon}
          <Suspense fallback="">
            {
              modalState.visible &&
              <Modal childProps={modalState.childProps} changeModalState={handleClose} number={modalState.number} title={modalState.title} >
                {modalState.content}
              </Modal>
            }
          </Suspense>
        </div>
        <div style={{ minWidth: "80px", width: "15%", textAlign: "left" }}>{date}</div>
        <div style={{ minWidth: "60px", width: "15%", textAlign: "left" }}> {number}</div>
        <div style={{ width: "40%", textAlign: "left" }}>
          {participants}
          <IoMdPeople cursor="pointer" onClick={onParticipantsClick} size="20" display="block" style={{ float: "left", marginRight: "10px" }} color="gray" />
        </div>
        <div style={{ width: "60px" }}>
          <IoMdChatbubbles size="20" color="#4285F4" cursor="pointer" onClick={onInfoClick} />
        </div>
        <div style={{ width: "20px" }}>{referer === "protected" && (status === 20 || status === 99 || status === 44) && <IoMdMore pointer="cursor" onClick={handleFinishClick} />}</div>
      </li>
    </>
  )
}
export default React.memo(ListItem)
