import React, { useState, useEffect, lazy, useRef } from 'react'
import {
  FaCommentAlt
} from 'react-icons/fa'
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosClock,
  IoIosAlert,
  IoIosArchive,
  IoMdList,
  IoIosOptions
} from 'react-icons/io'
import CommentContainer from './CommentContainer'
const ParticipantsModal = lazy(() => import('./modal content/Participants'))


export default (props) => {
  const participantsString = props.participants.reduce((sum, participant, index) => {
    let char = index === 0 ? '' : ', '
    sum += char + participant.surname + ' ' + participant.name.substring(0, 1) + '.'
    return sum
  }
    , '')
  const onParticipantsClick = (participants, number) => {
    props.setModalContent(_ => <ParticipantsModal participants={participants} number={number} />)
    props.setModalVisibility(prevState => !prevState)
  }

  const onActionClick = () => {

  }
  const handleWidthChange = () => {
    setScreenSize(_ => window.innerWidth);
  }
  // const changeBlur = props.changeBlur
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const participantsRef = useRef(null);


  useEffect(
    () => {
      window.addEventListener('resize', handleWidthChange, false);
      return _ => window.removeEventListener('resize', handleWidthChange, false)
    }
    , []
  )
  useEffect(
    () => {
      let isSmall = false;
      if (screenSize < 830)
        isSmall = true;
      else
        isSmall = false;
      setIsSmallScreen(_ => isSmall)
      setCharCount(_ => participantsRef.current.clientWidth)
    }
    , [screenSize])
  // useEffect(
  //   () => {
  //     setCharCount(_=>participantsRef.current.clientWidth/10);
  //     console.log(participantsRef.current.clientWidth/10);
  //   }, [participantsRef.current.clientWidth])
  return (
    <>
      <li>
        <div style={{ width: '25px' }}>{props.rowNumber}</div>
        <div style={{ width: '15%' }}> {isSmallScreen ? '' : props.status}
          {props.status === 'Baxılır' ?
            <IoIosAlert color='#F4B400' title='Baxılır' size='20' style={isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
            props.status === 'Təsdiqlənib' ?
              <IoIosCheckmarkCircle color='#0F9D58' title='Təsdiqlənib' size='20' style={isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
              props.status === 'Etiraz' ?
                <IoIosCloseCircle color='#DB4437' title='Etiraz' size='20' style={isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
                props.status === 'Gözlənilir' ?
                  <IoIosClock color='#4285F4' title='Gözlənilir' size='20' style={isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
                  props.status === 'Anbarda' ?
                    <IoIosArchive title='Anbarda' size='20' color='#777777' style={isSmallScreen ? styles.smallScreen : styles.biggerScreen} display='block' /> :
                    ''
          }
        </div>
        <div style={{ width: '20%' }}> {props.category}</div>
        <div style={{ width: '15%' }}> {props.number}</div>
        <div style={{ width: '20%' }} ref={participantsRef}>
          {
            participantsString.substring(0, charCount / 15) + '..'
          }
          <IoMdList onClick={_ => onParticipantsClick(props.participants, props.number)} size='20' display='block' style={styles.biggerScreen} color='#195db6' />
        </div>
        <div style={{ width: '15%' }}> {props.deadline}</div>
        <div style={{ width: '5%' }}>
          <div style={{ margin: 'auto', height: '100%', width: '40px', position: 'relative', padding: '0px 2px', cursor: 'pointer' }} onMouseLeave={() => setIsCommentVisible(false)} onMouseEnter={() => setIsCommentVisible(true)}>
            <FaCommentAlt color='#a1a1a1' style={{verticalAlign: 'middle'}} />{props.remark}
            {
              isCommentVisible ?
                <CommentContainer number={props.number} /> :
                ''
            }
          </div>
        </div>
        <div style={{ overflow: 'hidden', cursor: 'pointer' }}>
          <IoIosOptions size='20' color='#606060' onClick={onActionClick} />
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