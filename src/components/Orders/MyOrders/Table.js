import React, { useState, useEffect } from 'react'
import {
  FaSortDown,
  FaSortUp
} from 'react-icons/fa'
import TableContent from './TableContent';
const Table = (props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [createDateFilter, setCreateDateFilter] = useState(false)
  // const [deadlineFilter, setDeadlineFilter] = useState(false)
  const referer = props.referer;
  const [numberFilter, setNumberFilter] = useState(false)
  const setOrders = props.setOrders;
  useEffect(() => {
      const handleWidthChange = () => {
        if (window.innerWidth < 830)
          setIsSmallScreen(_ => true)
      }
      window.addEventListener('resize', handleWidthChange, false);
      return () => window.removeEventListener('resize', handleWidthChange, false)
    }, [])

  const createDateFilterIcon = !createDateFilter
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setCreateDateFilter(_ => !_)} />
    : <FaSortUp onClick={() => setCreateDateFilter(_ => !_)} style={{ float: 'right', marginRight: '10px' }} />
  const numberIcon = !numberFilter
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setNumberFilter(_ => !_)} />
    : <FaSortUp onClick={() => setNumberFilter(_ => !_)} style={{ float: 'right', marginRight: '10px' }} />
  return (
    <ul className='table'>
      <li>
        <div style={{ width: '30px' }}> #</div>
        <div style={{ minWidth: '80px' }}> Status</div>
        <div style={{ minWidth: '80px', width: '15%', textAlign: 'left', paddingRight: '10px' }}> Tarix {createDateFilterIcon}</div>
        <div style={{ minWidth: '60px', width: '15%', textAlign: 'left' }}> Nömrə {numberIcon}</div>
        <div style={{ width: '40%', paddingLeft: !isSmallScreen ? '30px' : '', textAlign: 'left' }}> İştirakçılar</div>
        <div style={{ minWidth: '5%' }}> Qeyd</div>
        <div style={{ minWidth: '40px', overflow: 'visible', display: 'inline-block', width: 'auto' }}> </div>
        <div></div>
      </li>
      <TableContent
        referer={referer}
        orders={props.orders}
        wrapperRef={props.wrapperRef}
        setOrders={setOrders}
      />
    </ul>
  )
}

export default Table