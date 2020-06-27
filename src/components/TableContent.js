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
// const memoizedItems = props.orders.map((order, index) => useMemoizeItems(order, index, activeLinkIndex, props.wrapperRef))
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
        status={order.status}
        number={order.number}
        category={order.category}
        participants={order.participants}
        deadline={order.deadline}
        remark=''
        activeLinkIndex={active}
        setActiveLink={setActiveLinkIndex}
      />
      // , [index, order.category, order.deadline, order.number, order.participants, order.status, active]
    )
  })
)
}
export default TableContent