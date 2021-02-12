import React, { lazy, useState, useContext } from 'react'
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
  IoMdInformationCircle,
  IoMdMore
} from 'react-icons/io'
import CommentContainer from './CommentContainer'
import ActionsContainer from './ActionsContainer'
import EditOrderRequest from '../../modal content/EditOrderRequest'
import { TokenContext } from '../../../App'
const FinishOrder = lazy(() => import('../../modal content/FinishOrder'))
const ParticipantsModal = lazy(() => import('../../modal content/Participants'))
const StatusModal = lazy(() => import('../../modal content/Status'))
const Modal = lazy(() => import('../../Misc/Modal'))
const ListItem = (props) => {
  const tokenContext = useContext(TokenContext);
  const token = tokenContext[0].token;
  const userData = tokenContext[0].userData;
  const { referer, setOrders, order } = props;
  const { status, participants, create_date_time: date, ord_numb: number } = order
  const [modalState, setModalState] = useState({ visible: false, content: null, childProps: {} });

  const handleClose = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  }
  const onParticipantsClick = (number) => {
    const childProps = {
      empVersion: userData.userInfo.id,
      number: number
    }
    setModalState({ visible: true, content: ParticipantsModal, childProps: childProps })
  }
  const onStatusClick = (number) => {
    const childProps = {
      number: number
    }
    setModalState({ visible: true, content: StatusModal, childProps: childProps })
  }
  const handleFinishClick = () => {
    const childProps = {
      version: props.order.emp_id,
      ordNumb: number,
      token: token
    }
    setModalState({ visible: true, content: FinishOrder, childProps: childProps })
  }
  const onInfoClick = (number) => {
    const onSendClick = (data, setOperationResult) => {
      const reqData = JSON.stringify(data);
      fetch('http://192.168.0.182:54321/api/new-order', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Content-Length': reqData.length
        },
        body: reqData
      })
        .then(resp => {
          if (resp.status === 200)
            return resp.json()
          else
            throw new Error('Internal Server Error');
        })
        .then(respJ => {
          if (respJ[0].result === 'success') {
            setOrders(prev => {
              const newList = prev.orders.filter(order => order.ord_numb !== number);
              setModalState(prev => ({ ...prev, visible: false }))
              return ({ orders: newList, count: newList.count })
            });
          }
          else if (respJ[0].error)
            setOperationResult({ visible: true, desc: respJ[0].error })
          else
            throw new Error('Error Performing operation')
        })
    }
    const childProps = {
      version: -1,
      ordNumb: number,
      view: referer,
      onSendClick
    }
    setModalState({ visible: true, content: EditOrderRequest, childProps })
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
            modalState.visible &&
            <Modal childProps={modalState.childProps} changeModalState={handleClose} >
              {modalState.content}
            </Modal>
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
        <div>{referer === 'protected' && <IoMdMore pointer="cursor" onClick={handleFinishClick} />}</div>
      </li>
    </>
  )
}
export default React.memo(ListItem)
