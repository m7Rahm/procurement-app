import React, { useState, useCallback, useEffect } from 'react'
import ListItem from './ListItem'
const TableContent = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const orders = props.orders.orders;
  const setOrders = props.setOrders;
  const referer = props.referer;
  const handleOnOuterClick = useCallback((e) => {
    const target = e.target.closest('div')
    if (target) {
      const activeOptions = (!target.classList.contains('options-button') || activeLinkIndex === parseInt(target.id))
        ? null
        : parseInt(target.id);
      setActiveLinkIndex(_ => activeOptions);
    }
  }, [activeLinkIndex])
  useEffect(() => {
    document.addEventListener('click', handleOnOuterClick, false);
    return () => document.removeEventListener('click', handleOnOuterClick, false)
  }
    , [handleOnOuterClick]
  )
  return (
    orders.map((order, index) => {
      const active = index === activeLinkIndex ? true : false;
      return (
        <ListItem
          wrapperRef={props.wrapperRef}
          setModalContent={props.setModalContent}
          setModalVisibility={props.setModalVisibility}
          index={index}
          key={order.id}
          order={order}
          activeLinkIndex={active}
          setActiveLink={setActiveLinkIndex}
          referer={referer}
          setOrders={setOrders}
          status={order.status}
          participants={order.participants}
          date={order.create_date_time}
          id={order.id}
          number={order.ord_numb}
        />
      )
    })
  )
}
export default TableContent