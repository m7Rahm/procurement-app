import React, { useEffect, useState } from 'react'
import {
  FaSortDown,
  FaSortUp
} from 'react-icons/fa'
import TableContent from './TableContent';
const Table = (props) => {
  const [sortDateUp, setSortDateUp] = useState(undefined)
  // const [deadlineFilter, setDeadlineFilter] = useState(false)
  const referer = props.referer;
  const [sortNumberUp, setSortNumberUp] = useState(undefined)
  const [sortStatusUp, setSortStatusUp] = useState(undefined)
  const setOrders = props.setOrders;
  useEffect(() => {
    if (sortDateUp !== undefined) {
      const asc = (a, b) => a.id > b.id ? 1 : -1
      const desc = (a, b) => a.id > b.id ? -1 : 1
      setOrders(prev => ({ ...prev, orders: [...prev.orders.sort(sortDateUp ? asc : desc)] }))
    }
  }, [sortDateUp, setOrders])
  useEffect(() => {
    if (sortNumberUp !== undefined) {
      const asc = (a, b) => a.id > b.id ? 1 : -1
      const desc = (a, b) => a.id > b.id ? -1 : 1
      setOrders(prev => ({ ...prev, orders: [...prev.orders.sort(sortNumberUp ? asc : desc)] }))
    }
  }, [sortNumberUp, setOrders])
  useEffect(() => {
    if (sortStatusUp !== undefined) {
      const asc = (a, b) => a.status > b.status ? 1 : -1
      const desc = (a, b) => a.status > b.status ? -1 : 1
      setOrders(prev => ({ ...prev, orders: [...prev.orders.sort(sortStatusUp ? asc : desc)] }))
    }
  }, [sortStatusUp, setOrders])
  const sortByDate = () => {
    setSortDateUp(prev => !prev)
  }
  const sortByNumber = () => {
    setSortNumberUp(prev => !prev)
  }
  const createDateFilterIcon = !sortDateUp
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={sortByDate} />
    : <FaSortUp onClick={sortByDate} style={{ float: 'right', marginRight: '10px' }} />
  const numberIcon = !sortNumberUp
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={sortByNumber} />
    : <FaSortUp onClick={sortByNumber} style={{ float: 'right', marginRight: '10px' }} />
  const sortIcon = !sortStatusUp
    ? <FaSortDown style={{ float: 'right', marginRight: '10px' }} onClick={() => setSortStatusUp(prev => !prev)} />
    : <FaSortUp onClick={() => setSortStatusUp(prev => !prev)} style={{ float: 'right', marginRight: '10px' }} />
return (
  <ul className='table'>
    <li style={{ justifyContent: "space-between" }}>
      <div style={{ width: '30px', textAlign: "center" }}> #</div>
      <div style={{ minWidth: '80px', textAlign: "center" }}> Status {sortIcon}</div>
      <div style={{ minWidth: '80px', width: '15%', textAlign: 'left' }}> Tarix {createDateFilterIcon}</div>
      <div style={{ minWidth: '60px', width: '15%', textAlign: 'left' }}> Nömrə {numberIcon}</div>
      <div style={{ width: '40%', textAlign: 'left' }}> İştirakçılar</div>
      <div style={{ minWidth: '5%', width: "60px" }}> Qeyd</div>
      {/* <div style={{ minWidth: '40px', overflow: 'visible', display: 'inline-block', width: 'auto' }}> </div> */}
      <div style={{ width: "20px" }}></div>
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