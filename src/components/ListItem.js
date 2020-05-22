import React, { useState, lazy} from 'react'
import {
  FaCommentAlt,
  FaBoxOpen
} from 'react-icons/fa'
import {
  IoMdCheckmark,
  IoMdClose,
  IoMdPaperPlane,
  IoMdDoneAll,
  IoMdPeople,
  IoIosOptions
} from 'react-icons/io'
import CommentContainer from './CommentContainer'
import ActionsComponent from'./ActionsComponent'
const ParticipantsModal = lazy(() => import('./modal content/Participants'))
const StatusModal = lazy(() => import('./modal content/Status'))


export default (props) => {
  const participantsString = props.participants.reduce((sum, participant, index) => {
    let char = index === 0 ? '' : ', '
    sum += char + participant.surname + ' ' + participant.name.substring(0, 1) + '.'
    return sum
  }
    , '')
  const onParticipantsClick = (participants, number) => {
    props.setModalContent(_ => <ParticipantsModal changeModalState={props.setModalVisibility} participants={participants} number={number} />)
    props.setModalVisibility(prevState => !prevState)
  }
  // const onActionClick = () => {
  //   let activeIndex = null
  //   props.activeLinkIndex ?
  //   activeIndex = null :
  //   activeIndex = props.index
  //   props.setActiveLink(_ => activeIndex)
  // }
  const onStatusClick = (number) => {
    props.setModalContent(_ => <StatusModal changeModalState={props.setModalVisibility} number={number} />)
    props.setModalVisibility(prevState => !prevState)
  }
  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const charCount = props.isSmallScreen ? 6 : 14
  // console.log(props.activeLinkIndex, isActionsVisible)
  // useEffect(
  //   () => {
  //     setCharCount(_=>participantsRef.current.clientWidth/10);
  //     console.log(participantsRef.current.clientWidth/10);
  //   }, [participantsRef.current.clientWidth])
  return (
    <>
      <li>
        <div style={{ width: '30px', fontWeight:'520', color:'#505050' }}>{props.index + 1}</div>
        <div style={{ width: '15%' }}> {props.isSmallScreen ? '' : props.status}
          {props.status === 'Baxılır' ?
            <IoMdCheckmark onClick={() => onStatusClick(props.number)} color='#F4B400' title='Baxılır' size='20' style={props.isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
            props.status === 'Təsdiqlənib' ?
              <IoMdDoneAll onClick={() => onStatusClick(props.number)} color='#0F9D58' title='Təsdiqlənib' size='20' style={props.isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
              props.status === 'Etiraz' ?
                <IoMdClose onClick={() => onStatusClick(props.number)} color='#DB4437' title='Etiraz' size='20' style={props.isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
                props.status === 'Gözlənilir' ?
                  <IoMdPaperPlane onClick={() => onStatusClick(props.number)} color='#4285F4' title='Gözlənilir' size='20' style={props.isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
                  props.status === 'Anbarda' ?
                    <FaBoxOpen onClick={() => onStatusClick(props.number)} title='Anbarda' size='20' color='#777777' style={props.isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
                    ''
          }
        </div>
        <div style={{ width: '20%' }}> {props.category}</div>
        <div style={{ width: '15%' }}> {props.number}</div>
        <div style={{ width: '20%' }}>
          {
            participantsString.substring(0, charCount) + '..'
          }
          <IoMdPeople onClick={_ => onParticipantsClick(props.participants, props.number)} size='20' display='block' style={styles.biggerScreen} color='gray' />
        </div>
        <div style={{ width: '15%' }}> {props.deadline}</div>
        <div style={{ width: '5%' }}>
          <div style={{ margin: 'auto', height: '100%', width: '40px', position: 'relative', padding: '0px 2px', cursor: 'pointer' }} onMouseLeave={() => setIsCommentVisible(false)} onMouseEnter={() => setIsCommentVisible(true)}>
            <FaCommentAlt color='#a1a1a1' style={{ verticalAlign: 'middle' }} />{props.remark}
            {
              isCommentVisible ?
                <CommentContainer number={props.number} /> :
                ''
            }
          </div>
        </div>
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
const styles = {
  smallScreen: {
    margin: 'auto',
  },
  biggerScreen: {
    float: 'left',
    margin: '0px 5px'
  }
}