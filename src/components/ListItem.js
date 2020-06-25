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
} from 'react-icons/io'
import CommentContainer from './CommentContainer'
import ActionsComponent from './ActionsComponent'
const ParticipantsModal = lazy(() => import('./modal content/Participants'))
const StatusModal = lazy(() => import('./modal content/Status'))
const Modal = lazy(() => import('./Modal'))



const ListItem = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setModalContent] = useState('')
  // const participantsString = props.participants.reduce((sum, participant, index) => {
  //   let char = index === 0 ? '' : ', '
  //   sum += char + participant.surname + ' ' + participant.name.substring(0, 1) + '.'
  //   return sum
  // }
  //   , '')
  const onParticipantsClick = (participants, number) => {
    setModalContent(_ => <ParticipantsModal changeModalState={setIsModalOpen} participants={participants} number={number} />)
    // props.wrapperRef.current.style.filter = "blur(4px)"
    setIsModalOpen(prevState => !prevState)
  }
  // const onActionClick = () => {
  //   let activeIndex = null
  //   props.activeLinkIndex ?
  //   activeIndex = null :
  //   activeIndex = props.index
  //   props.setActiveLink(_ => activeIndex)
  // }
  const onStatusClick = (number) => {
    setModalContent(_ => <StatusModal changeModalState={setIsModalOpen} number={number} />)
    // props.wrapperRef.current.style.filter = "blur(4px)"
    setIsModalOpen(prevState => !prevState)
  }
  const icon = props.status === 'Baxılır' ?
    <IoMdCheckmark onClick={() => onStatusClick(props.number)} color='#F4B400' title={props.status} size='20' style={{ margin: 'auto', }} /> :
    props.status === 'Tamamlanmışdır' ?
      <IoMdDoneAll onClick={() => onStatusClick(props.number)} color='#0F9D58' title={props.status} size='20' style={{ margin: 'auto', }} /> :
      props.status === 'Etiraz' ?
        <IoMdClose onClick={() => onStatusClick(props.number)} color='#DB4437' title={props.status} size='20' style={{ margin: 'auto', }} /> :
        props.status === 'Gözlənilir' ?
          <IoMdPaperPlane onClick={() => onStatusClick(props.number)} color='#4285F4' title={props.status} size='20' style={{ margin: 'auto', }} /> :
          props.status === 'Anbarda' ?
            <FaBoxOpen onClick={() => onStatusClick(props.number)} title={props.status} size='20' color='#777777' style={{ margin: 'auto', }} /> :
            props.status === 'Təsdiq edilib' ?
              <IoMdCheckmark onClick={() => onStatusClick(props.number)} color='#0F9D58' title={props.status} size='20' style={{ margin: 'auto', }} /> :
              ''

  // console.log(props.activeLinkIndex, isActionsVisible)
  // useEffect(
  //   () => {
  //     setCharCount(_=>participantsRef.current.clientWidth/10);
  //     console.log(participantsRef.current.clientWidth/10);
  //   }, [participantsRef.current.clientWidth])
  return (
    <>
      <li>
        <div style={{ width: '30px', fontWeight: '520', color: '#505050' }}>{props.index + 1}</div>
        <div style={{ width: '80px' }}>
          {
            icon
          }
          {
            isModalOpen ?
              <Suspense fallback={<div>loading..</div>}>
                <Modal wrapperRef={props.wrapperRef} changeModalState={setIsModalOpen} content={content} />
              </Suspense> :
              ''
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
        {/* <div style={{ minWidth: '60px' }}> <IoMdDocument size='20' color='gray' /></div> */}
        <div id={props.index} className='options-button' style={{ overflow: 'visible', cursor: 'pointer', clear: 'left', display: 'inline-block', width: 'auto' }}>
          <IoIosOptions size='20' color='#606060' />
          {
            props.activeLinkIndex ?
              <ActionsComponent /> :
              ''
          }
        </div>
      </li>
      {/* {
        isModalOpen ?
          <Modal changeModalState={memoizedModalControlCallback} content={<Suspense fallback={<div>Loading ..</div>}>{content}</Suspense>}>
          </Modal>
          : ''
      } */}
    </>
  )
}
export default ListItem
// const styles = {
//   smallScreen: {
//     margin: 'auto',
//   },
//   biggerScreen: {
//     float: 'left',
//     margin: '0px 5px'
//   }
// }