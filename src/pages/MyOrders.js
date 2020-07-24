import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import Table from '../components/Table'
import Search from '../components/Search'
import NewOrderButton from '../components/NewOrderButton';
// import { orders } from '../data/data'

const MyOrders = (props) => {
  const wrapperRef = useRef(props.webSocketRef);
  const [orders, setOrders] = useState([])
  useEffect(() => {
    //todo: create socket and connect
    fetch('http://172.16.3.101:54321/api/orders?from=0&until=20')
    .then(resp => resp.json())
    .then(respJ => {
      setOrders(respJ)
    })
    .catch(err => console.log(err))
    if (props.webSocketRef) {
      props.webSocketRef.onmessage = (msg) => {
        // console.log(msg)
      };
    }
  }, [props.webSocketRef])
  return (
    <div className="app">
      <Search />
      <div className="wrapper" ref={wrapperRef}>
        <Table wrapperRef={wrapperRef} orders={orders} />
      </div>
      <NewOrderButton webSocketRef={props.webSocketRef} setOrders={setOrders} wrapperRef={wrapperRef} />
    </div>
  )
}
export default MyOrders