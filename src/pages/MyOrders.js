import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import Table from '../components/Table'
import Search from '../components/Search'
import NewOrderButton from '../components/NewOrderButton';
import Pagination from '../components/Pagination';
// import { orders } from '../data/data'

const MyOrders = (props) => {
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [], userData: {} });
  const webSocketRef = useRef(props.webSocketRef.current);
  const activePageRef = useRef(0);
  const updateList = (from) => {
    fetch(`http://172.16.3.101:54321/api/orders?from=${from}&until=20`,{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(resp => resp.json())
      .then(respJ => {
        const totalCount = respJ[0] ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    //todo: create socket and connect
    fetch('http://172.16.3.101:54321/api/orders?from=0&until=20',{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(resp => resp.json())
      .then(respJ => {
        console.log(respJ)
        const totalCount = respJ.response[0] ? respJ.response[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ.response, userData: respJ.userData });
      })
      .catch(err => console.log(err))
    // if (props.webSocketRef) {
    webSocketRef.current.onmessage = (msg) => {
    };
    // }
  }, [])
  return (
    <div className="app">
      <Search />
      <div className="wrapper" ref={wrapperRef}>
        <Table wrapperRef={wrapperRef} orders={orders} />
      </div>
      <NewOrderButton
        webSocketRef={webSocketRef}
        setOrders={setOrders}
        wrapperRef={wrapperRef}
      />
      <div className="my-orders-footer">
        <Pagination
          count={orders.count}
          activePageRef={activePageRef}
          updateList={updateList}
        />
      </div>
    </div>
  )
}
export default MyOrders