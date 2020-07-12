import React, { useRef, useEffect } from 'react';
import '../App.css';
import Table from '../components/Table'
import Search from '../components/Search'
import NewOrderButton from '../components/NewOrderButton';
import {orders} from '../data/data'

const MyOrders = () => {
  const wrapperRef = useRef(null);
  useEffect(() => {
    //todo: create socket and connect
  }, [])
  return (
    <div className="app">
      <Search />
      <div className="wrapper" ref={wrapperRef}>
        <Table wrapperRef={wrapperRef} orders={orders} />
      </div>
      <NewOrderButton wrapperRef={wrapperRef} />
    </div>
  )
}
export default MyOrders