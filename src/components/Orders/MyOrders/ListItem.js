import React, { lazy, useState, useContext, useCallback } from "react"
import { FaBoxOpen, FaBox, FaShoppingCart } from "react-icons/fa"
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
  const token = props.token;
  const fetchGet = useFetch("GET");
  const fetchMessages = useCallback((from = 0) =>
    fetchGet(`http://192.168.0.182:54321/api/messages/${props.id}?from=${from}&replyto=0&doctype=${10}`)
    , [props.id, fetchGet]);
  const sendMessage = useCallback(async data => {
    const formData = new FormData();
    formData.append("replyto", data.replyto);
    formData.append("docid", data.docid);
    formData.append("message", data.message);
    formData.append("docType", 10);
    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i]);
    }
    const resp = await fetch(`http://192.168.0.182:54321/api/send-message`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: formData
    })
    return await resp.json()
  }, [token]);
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
  const structureType = tokenContext[0].userData.userInfo.sType;
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
  const onInfoClick = () => {
    const onSendClick = (data, setOperationResult) => {
      const formData = new FormData();
      formData.append("orderType", data.orderType)
      formData.append("mats", JSON.stringify(data.mats))
      formData.append("receivers", JSON.stringify(data.receivers))
      formData.append("ordNumb", data.ordNumb)
      formData.append("structureid", data.structureid)
      formData.append("returned", data.returned);
      if (structureType === 2)
        formData.append("iswo", 1)
      fetch("http://192.168.0.182:54321/api/new-order", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formData
      })
        .then(resp => resp.json())
        .then(respJ => {
          if (respJ[0].result === "success") {
            const message = {
              message: "notification",
              receivers: respJ
                .filter(receiver => receiver.receiver)
                .map(receiver => ({ id: receiver.receiver, notif: "newOrder" })),
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
      token,
      structureType,
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
                ? <FaBox color="#aaaaaa" title="Anbara daxil oldu" size="20" />
                : status === 40 ?
                  <FaShoppingCart color="#EC4646" size="18" title="Qiymət araşdırılması" />
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
        <div className="participants-list-container">
          <IoMdPeople cursor="pointer" onClick={onParticipantsClick} size="20" display="block" style={{ position: "absolute", left: "0px" }} color="gray" />
          <input className="participants-list" defaultValue={participants ? participants.slice(0, -2) : ""} disabled={true} />
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
