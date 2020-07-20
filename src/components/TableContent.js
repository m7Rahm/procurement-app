import React, { useState, useCallback, useEffect } from 'react'
import ListItem from './ListItem'
// import useMemoizeItems from './MemoizeItems'
const TableContent = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const handleOnOuterClick = useCallback((e) => {
    const target = e.target.closest('div')
    if (target) {
      const activeOptions = (!target.classList.contains('options-button') || activeLinkIndex === parseInt(target.id))
        ? null
        : parseInt(target.id);
        setActiveLinkIndex(_ => activeOptions);
    }
}, [activeLinkIndex])
useEffect(
  () => {
    document.addEventListener('click', handleOnOuterClick, false);
    return () => document.removeEventListener('click', handleOnOuterClick, false)
  }
  , [handleOnOuterClick]
)
return (
  props.orders.map((order, index) => {
    const active = index === activeLinkIndex ? true : false;
    return (
      <ListItem
        wrapperRef={props.wrapperRef}
        setModalContent={props.setModalContent}
        setModalVisibility={props.setModalVisibility}
        index={index}
        key={index}
        date={order.create_date_time}
        status={order.status}
        number={order.id}
        category={order.assignment}
        participants={order.participants}
        deadline={order.deadline}
        remark={order.comment}
        activeLinkIndex={active}
        setActiveLink={setActiveLinkIndex}
      />
      // , [index, order.category, order.deadline, order.number, order.participants, order.status, active]
    )
  })
)
}
export default TableContent