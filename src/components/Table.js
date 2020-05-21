import React, { useState, useEffect, useCallback, useMemo } from 'react'
import ListItem from './ListItem'
export default (props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeLinkIndex, setactiveLinkIndex] = useState(null);
  useEffect(
    () => {
      window.addEventListener('resize', handleWidthChange, false);
      return _ => window.removeEventListener('resize', handleWidthChange, false)
    }
    , []
  )
  const setactiveLinkIndexCallback = useCallback(setactiveLinkIndex, []);
    const handleWidthChange = () => {
      let isSmall = false;
      if (window.innerWidth < 830)
        isSmall = true;
      else
        isSmall = false;
      setIsSmallScreen(_ => isSmall)
    }
  return (
    <ul className='table'>
      <li key={-1}>
        <div style={{ width: '25px' }}> #</div>
        <div style={{ width: '15%', paddingLeft: '30px' }}> Status</div>
        <div style={{ width: '20%' }}> Katqoriya</div>
        <div style={{ width: '15%' }}> Nömrə</div>
        <div style={{ width: '20%', paddingLeft: '30px' }}> İştirakçılar</div>
        <div style={{ width: '15%' }}> Deadline</div>
        <div style={{ width: '5%' }}> Qeyd</div>
        <div style={{ overflow: 'visible', display: 'inline-block', width: '40px' }}>  </div>
      </li>
      {
        props.orders.map((order, index) => {
          const active = index===activeLinkIndex? true : false;
          const isSmall = isSmallScreen
        return useMemo(()=>
          <ListItem
            setModalContent={props.setModalContent}
            setModalVisibility={props.setModalVisibility}
            index={index}
            key={index}
            rowNumber={index + 1}
            status={order.status}
            number={order.number}
            category={order.category}
            participants={order.participants}
            deadline={order.deadline}
            remark=''
            action=''
            isSmallScreen={isSmall}
            setactiveLinkIndex={setactiveLinkIndexCallback}
            activeLinkIndex={active}
          />, [index, order.category, order.deadline, order.number, order.participants, order.status, active, isSmall])
        }
          )
      }
    </ul>
  )
}

