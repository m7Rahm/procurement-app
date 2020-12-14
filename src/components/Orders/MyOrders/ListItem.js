import React, { lazy, useState, Suspense, useContext } from 'react'
import {
  FaBoxOpen
} from 'react-icons/fa'
import {
  IoMdCheckmark,
  IoMdClose,
  IoMdPaperPlane,
  IoMdDoneAll,
  IoMdPeople,
  IoIosOptions,
  IoMdRefreshCircle,
  IoMdInformationCircle
} from 'react-icons/io'
import CommentContainer from './CommentContainer'
import ActionsContainer from './ActionsContainer'
import EditOrderRequest from '../../modal content/EditOrderRequest'
import { TokenContext } from '../../../App'
import Loading from '../../Misc/Loading'
const ParticipantsModal = lazy(() => import('../../modal content/Participants'))
const StatusModal = lazy(() => import('../../modal content/Status'))
const Modal = lazy(() => import('../../Misc/Modal'))
const ListItem = (props) => {
  const tokenContext = useContext(TokenContext);
  const token = tokenContext[0].token;
  const userData = tokenContext[0].userData;
  const order = props.order;
  const { status, participants } = order
  const date = order.create_date_time;
  const { referer, setOrders } = props;
  const number = order.ord_numb;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const handleClose = () => {
    setIsModalOpen(_ => false);
  }
  const onParticipantsClick = (number) => {
    setModalContent(_ => (props) => <ParticipantsModal empVersion={userData.userInfo.id} number={number} {...props} />)
    setIsModalOpen(prevState => !prevState)
  }
  const onStatusClick = (number) => {
    setModalContent(_ => (props) => <StatusModal number={number} {...props} />)
    setIsModalOpen(prev => !prev)
  }
  const onInfoClick = (number) => {
    const onSendClick = (data) => {
      const reqData = JSON.stringify(data);
      fetch('http://172.16.3.101:8000/api/new-order', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Content-Length': reqData.length
        },
        body: reqData
      })
        .then(resp => {
          if(resp.status === 200)
            return resp.json()
          else
              throw new Error('Internal Server Error');
      })
        .then(respJ => {
          if (respJ[0].result === 'success') {
            setOrders(prev => {
              const newList = prev.orders.filter(order => order.ord_numb !== number);
              setIsModalOpen(prev => !prev)
              return ({ orders: newList, count: newList.count })
            });
          }
        })
    }
    setModalContent(_ => (props) =>
      <EditOrderRequest
        version={-1}
        ordNumb={number}
        view={referer}
        onSendClick={onSendClick}
        {...props}
      />)
    setIsModalOpen(prevState => !prevState)
  }
  const icon = status === 0
    ? <IoMdCheckmark onClick={() => onStatusClick(number)} color='#F4B400' title="Baxılır" size='20' style={{ margin: 'auto', }} />
    : status === 'Tamamlanmışdır'
      ? <IoMdDoneAll onClick={() => onStatusClick(number)} color='#0F9D58' title={status} size='20' style={{ margin: 'auto', }} />
      : status === -1
        ? <IoMdClose onClick={() => onStatusClick(number)} color='#DB4437' title="Etiraz" size='20' style={{ margin: 'auto', }} />
        : status === 'Gözlənilir'
          ? <IoMdPaperPlane onClick={() => onStatusClick(number)} color='#4285F4' title={status} size='20' style={{ margin: 'auto', }} />
          : status === 'Anbarda'
            ? <FaBoxOpen onClick={() => onStatusClick(number)} title={status} size='20' color='#777777' style={{ margin: 'auto', }} />
            : status === 'Təsdiq edilib'
              ? <IoMdCheckmark onClick={() => onStatusClick(number)} color='#0F9D58' title={status} size='20' style={{ margin: 'auto', }} />
              : ''
  return (
    <>
      <li>
        <div style={{ width: '30px', fontWeight: '520', color: '#505050', textAlign: 'center' }}>{props.index + 1}</div>
        <div style={{ width: '80px', textAlign: 'center' }}>
          {icon}
          {
            isModalOpen &&
            <Suspense fallback={
              <div className={<Loading />}>
                <IoMdRefreshCircle size="50" color="#a4a4a4" />
              </div>
            }
            >
              <Modal changeModalState={handleClose} >
                {modalContent}
              </Modal>
            </Suspense>
          }
        </div>
        <div style={{ minWidth: '80px', width: '15%', textAlign: 'left' }}>{date}</div>
        <div style={{ minWidth: '60px', width: '15%', textAlign: 'left' }}> {number}</div>
        <div style={{ width: '40%', textAlign: 'left' }}>
          {
            participants
          }
          <IoMdPeople onClick={_ => onParticipantsClick(number)} size='20' display='block' style={{ float: 'left', marginRight: '10px' }} color='gray' />
        </div>
        <div style={{ width: '5%' }}>
          <CommentContainer remark={props.remark} number={number} />
        </div>
        <div id={props.index} className='options-button' style={{ flex: 1, overflow: 'visible', textAlign: 'center', cursor: 'pointer', display: 'inline-block', width: 'auto' }}>
          <IoIosOptions size='20' color='#606060' />
          {
            props.activeLinkIndex
              ? <ActionsContainer />
              : ''
          }
        </div>
        <div style={{ padding: '0px 10px' }}>
          <IoMdInformationCircle cursor="pointer" size='20' color='#606060' onClick={() => onInfoClick(number)} />
        </div>
      </li>
    </>
  )
}
export default React.memo(ListItem)
