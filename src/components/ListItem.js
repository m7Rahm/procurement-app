import React, { lazy, useState, Suspense } from 'react'
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
  IoMdRefreshCircle
} from 'react-icons/io'
import CommentContainer from './CommentContainer'
import ActionsContainer from './ActionsContainer'
const ParticipantsModal = lazy(() => import('./modal content/Participants'))
const StatusModal = lazy(() => import('./modal content/Status'))
const Modal = lazy(() => import('./Modal'))

const ListItem = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setModalContent] = useState('')
  const handleClose = () => {
    setIsModalOpen(_ => false);
  }
  const onParticipantsClick = (participants, number) => {
    setModalContent(_ => <ParticipantsModal participants={participants} number={number} />)
    setIsModalOpen(prevState => !prevState)
  }
  const onStatusClick = (number) => {
    setModalContent(_ => <StatusModal number={number} />)
    setIsModalOpen(prevState => !prevState)
  }
  const icon = props.status === 'Baxılır'
    ? <IoMdCheckmark onClick={() => onStatusClick(props.number)} color='#F4B400' title={props.status} size='20' style={{ margin: 'auto', }} />
    : props.status === 'Tamamlanmışdır'
      ? <IoMdDoneAll onClick={() => onStatusClick(props.number)} color='#0F9D58' title={props.status} size='20' style={{ margin: 'auto', }} />
      : props.status === 'Etiraz'
        ? <IoMdClose onClick={() => onStatusClick(props.number)} color='#DB4437' title={props.status} size='20' style={{ margin: 'auto', }} />
        : props.status === 'Gözlənilir'
          ? <IoMdPaperPlane onClick={() => onStatusClick(props.number)} color='#4285F4' title={props.status} size='20' style={{ margin: 'auto', }} />
          : props.status === 'Anbarda'
            ? <FaBoxOpen onClick={() => onStatusClick(props.number)} title={props.status} size='20' color='#777777' style={{ margin: 'auto', }} />
            : props.status === 'Təsdiq edilib'
              ? <IoMdCheckmark onClick={() => onStatusClick(props.number)} color='#0F9D58' title={props.status} size='20' style={{ margin: 'auto', }} />
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
              <div className="loading">
                <IoMdRefreshCircle size="50" color="#a4a4a4" />
              </div>}>
              <Modal changeModalState={handleClose} >
                {content}
              </Modal>
            </Suspense>
          }
        </div>
        <div style={{ minWidth: '80px', width: '15%', textAlign: 'left' }}>{props.deadline}</div>
        <div style={{ minWidth: '60px', width: '15%', textAlign: 'left' }}> {props.number}</div>
        <div style={{ minWidth: '100px', width: '10%', textAlign: 'left' }}> {props.deadline}</div>
        <div style={{ minWidth: '70px', overflow: 'hidden', width: '20%', textAlign: 'left' }}> {props.category}</div>
        <div style={{ width: '20%', textAlign: 'left' }}>
          {
            'sfagdsgasfadadasda'
          }
          <IoMdPeople onClick={_ => onParticipantsClick(props.participants, props.number)} size='20' display='block' style={{ float: 'left', marginRight: '10px' }} color='gray' />
        </div>
        <div style={{ width: '5%' }}>
          <CommentContainer remark={props.remark} number={props.number} />
        </div>
        <div id={props.index} className='options-button' style={{ flex: 1, overflow: 'visible', textAlign: 'center', cursor: 'pointer', display: 'inline-block', width: 'auto' }}>
          <IoIosOptions size='20' color='#606060' />
          {
            props.activeLinkIndex
              ? <ActionsContainer />
              : ''
          }
        </div>
      </li>
    </>
  )
}
export default React.memo(ListItem)
