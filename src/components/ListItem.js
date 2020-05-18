import React, { useState, useEffect, lazy, Suspense } from 'react'
import {
  FaCommentAlt,
  FaEllipsisH
} from 'react-icons/fa'
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosClock,
  IoIosAlert,
  IoIosArchive,
  IoMdList
} from 'react-icons/io'
import Modal from './Modal'
const ParticipantsModal = lazy(() => import('./modal content/Participants'))
export default (props) => {
  const onStatusClick = () => {

  }
  const participantsString = props.participants.reduce((sum, participant, index) => {
    let char = index === 0 ? '' : ', '
    sum += char + participant.surname + ' ' + participant.name.substring(0, 1) + '.'
    return sum
  }
    , '')
  const onParticipantsClick = (participants) => {
    setContent(_ => <ParticipantsModal participants={participants} />)
    setIsModalOpen(prevState => !prevState)
  }
  const onCommentClick = () => {
    setIsModalOpen(prevState => !prevState)
  }
  const onActionClick = () => {

  }
  const handleWidthChange = () => {
    setScreenSize(_ => window.innerWidth);
    console.log(window.innerWidth)
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [content, setContent] = useState('');

  useEffect(
    () => {
      window.addEventListener('resize', handleWidthChange, false)
      return _ => window.removeEventListener('resize', handleWidthChange, false)
    }
    , []
  )
  useEffect(
    () => {
      let isSmall = false;
      if (screenSize < 800)
        isSmall = true;
      else
        isSmall = false;
      setIsSmallScreen(_ => isSmall)
    }
    , [screenSize])
  return (
    <>
      <li>
        <div style={{ width: '25px' }}>{props.rowNumber}</div>
        <div style={{ width: '15%' }}> {isSmallScreen ? '' : props.status}
          {props.status === 'Baxılır' ?
            <IoIosAlert color='#F4B400' title='Baxılır' size='20' style={{ float: isSmallScreen ? '' : 'right', margin: isSmallScreen ? 'auto' : '' }} display='block' /> :
            props.status === 'Təsdiqlənib' ?
              <IoIosCheckmarkCircle color='#0F9D58' title='Təsdiqlənib' size='20' style={{ float: isSmallScreen ? '' : 'right', margin: isSmallScreen ? 'auto' : '' }} display='block' /> :
              props.status === 'Etiraz' ?
                <IoIosCloseCircle color='#DB4437' title='Etiraz' size='20' style={{ float: isSmallScreen ? '' : 'right', margin: isSmallScreen ? 'auto' : '' }} display='block' /> :
                props.status === 'Gözlənilir' ?
                  <IoIosClock color='#4285F4' title='Gözlənilir' size='20' style={{ float: isSmallScreen ? '' : 'right', margin: isSmallScreen ? 'auto' : '' }} display='block' /> :
                  props.status === 'Anbarda' ?
                    <IoIosArchive title='Anbarda' size='20' color='#777777' style={{ float: isSmallScreen ? '' : 'right', margin: isSmallScreen ? 'auto' : '' }} display='block' /> :
                    ''
          }
        </div>
        <div style={{ width: '20%' }}> {props.category}</div>
        <div style={{ width: '15%' }}> {props.number}</div>
        <div style={{ width: '20%' }}>
          {
            isSmallScreen ?
              participantsString.substring(0, 6) + '..' :
              participantsString.substring(0, 14) + '..'
          }
          <IoMdList onClick={_ => onParticipantsClick(props.participants)} size='20' display='block' style={{ verticalAlign: 'middle', float: 'right', marginRight: '3px', cursor: 'pointer' }} color='#195db6' />
        </div>
        <div style={{ width: '15%' }}> {props.deadline}</div>
        <div style={{ width: '5%', cursor: 'pointer' }}><FaCommentAlt color='#a1a1a1' onClick={onCommentClick} /> {props.remark}</div>
        <div style={{ overflow: 'hidden', cursor: 'pointer' }}><FaEllipsisH color='#a1a1a1' onClick={onActionClick} /></div>
      </li>
      {
        isModalOpen ?
          <Modal changeModalState={setIsModalOpen}>
            <Suspense fallback={<div>Loading ..</div>} >
              {
                content
              }
            </Suspense>
          </Modal>
          : ''
      }
    </>
  )
}