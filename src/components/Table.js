import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  FaSortDown,
  FaSortUp
} from 'react-icons/fa'
import ListItem from './ListItem'
export default (props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const [createDateFilter, setCreateDateFilter] = useState(false)
  const [deadlineFilter, setDeadlineFilter] = useState(false)
  const [numberFilter, setNumberFilter] = useState(false)
  const setActiveLinkIndexCallback = useCallback(setActiveLinkIndex, []);
  useEffect(
    () => {
      let isSmall = false;
      if (window.innerWidth < 830)
        isSmall = true;
      else
        isSmall = false;
      setIsSmallScreen(_ => isSmall)
    }
    , []
  )
  useEffect(
    () => {
      window.addEventListener('resize', handleWidthChange, false);
      return _ => window.removeEventListener('resize', handleWidthChange, false)
    }
    , []
  )
  const handleOnOuterClick = useCallback((e) => {
    const target = e.target.closest('div')
    let activeOptions = null
    target ?
      (activeOptions = (!target.classList.contains('options-button') || activeLinkIndex === parseInt(target.id)) ? null : parseInt(target.id)) :
      activeOptions = null
    setActiveLinkIndexCallback(_ => activeOptions)
  }, [setActiveLinkIndexCallback, activeLinkIndex])
  useEffect(
    () => {
      document.addEventListener('click', handleOnOuterClick, false);
      return _ => document.removeEventListener('click', handleOnOuterClick, false)
    }
    , [handleOnOuterClick]
  )
  const handleWidthChange = () => {
    let isSmall = false;
    if (window.innerWidth < 830)
      isSmall = true;
    else
      isSmall = false;
    setIsSmallScreen(_ => isSmall)
  }
  const createDateFilterIcon = !createDateFilter ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setCreateDateFilter(_ => !_)} /> : <FaSortUp onClick={() => setCreateDateFilter(_ => !_)} style={{ float: 'right', marginRight: '10px' }} />
  const deadlineIcon = !deadlineFilter ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setDeadlineFilter(_ => !_)} /> : <FaSortUp onClick={() => setDeadlineFilter(_ => !_)} style={{ float: 'right', marginRight: '10px' }} />
  const numberIcon = !numberFilter ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setNumberFilter(_ => !_)} /> : <FaSortUp onClick={() => setNumberFilter(_ => !_)} style={{ float: 'right', marginRight: '10px' }} />
  return (
    <ul className='table'>
      <li key={-1}>
        <div style={{ width: '30px' }}> #</div>
        <div style={{ minWidth: '80px' }}> Status</div>
        <div style={{ minWidth: '80px', width: '15%', textAlign: 'left', paddingRight: '10px' }}> Tarix {createDateFilterIcon}</div>
        <div style={{ minWidth: '60px', width: '15%', textAlign: 'left' }}> Nömrə {numberIcon}</div>
        <div style={{ minWidth: '100px', width: '10%', textAlign: 'left' }}> Deadline {deadlineIcon}</div>
        <div style={{ minWidth: '70px', width: '20%', textAlign: 'left' }}> Təyinatı</div>
        <div style={{ width: '20%', paddingLeft: !isSmallScreen ? '30px' : '', textAlign: 'left' }}> İştirakçılar</div>
        <div style={{ minWidth: '5%' }}> Qeyd</div>
        <div style={{ minWidth: '40px', overflow: 'visible', display: 'inline-block', width: 'auto' }}> </div>
      </li>
      {
        props.orders.map((order, index) => {
          const active = index === activeLinkIndex ? true : false;
          const isSmall = isSmallScreen
          return useMemo(() =>
            <ListItem
              setModalContent={props.setModalContent}
              setModalVisibility={props.setModalVisibility}
              index={index}
              key={index}
              status={order.status}
              number={order.number}
              category={order.category}
              participants={order.participants}
              deadline={order.deadline}
              remark=''
              action=''
              isSmallScreen={isSmall}
              activeLinkIndex={active}
              setActiveLink={setActiveLinkIndexCallback}
            />, [index, order.category, order.deadline, order.number, order.participants, order.status, active, isSmall])
        })
      }
    </ul>
  )
}

