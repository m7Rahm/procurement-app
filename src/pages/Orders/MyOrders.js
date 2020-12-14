import React, { useRef, useEffect, useState, useContext } from 'react';
import Table from '../../components/Orders/MyOrders/Table'
import Search from '../../components/Search/Search'
import NewOrderButton from '../../components/Orders/NewOrder/NewOrderButton';
import Pagination from '../../components/Misc/Pagination';
import { TokenContext } from '../../App'
const MyOrders = (props) => {
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const webSocketRef = useRef(props.webSocketRef.current);
  const activePageRef = useRef(0);
  const tokenContext = useContext(TokenContext);
  const token = tokenContext[0].token
  const userData = tokenContext[0].userData;
  const canCreateNewOrder = userData.previliges.includes('Sifariş yaratmaq');
  const [searchData, setSearchData] = useState({
    dateFrom: '',
    dateTill: '',
    status: -3,
    date: '',
    ordNumb: ''
  })
  const updateList = (from) => {
    const data = JSON.stringify({ ...searchData, from: from, until: 20 });
    fetch(`http://172.16.3.101:8000/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Length': data.length,
        'Content-Type': 'application/json'
      },
      body: data
    })
      .then(resp => resp.json())
      .then(respJ => {
        const totalCount = respJ[0] ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    const data = JSON.stringify({
      from: 0,
      until: 20,
      status: -3,
      dateFrom: '',
      dateTill: '',
      ordNumb: ''
    });
    //todo: create socket and connect
    fetch('http://172.16.3.101:8000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Length': data.length,
        'Content-Type': 'application/json'
      },
      body: data
    })
      .then(resp => resp.json())
      .then(respJ => {
        const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
    webSocketRef.current.onmessage = (msg) => {
    };
  }, [token])
  return (
    <>
      <Search
        searchData={searchData}
        setSearchData={setSearchData}
        updateList={updateList}
      />
      <div className="wrapper" ref={wrapperRef}>
        <Table
          wrapperRef={wrapperRef}
          orders={orders}
          referer="protected"
          setOrders={setOrders}
          />
      </div>
      {
        canCreateNewOrder &&
        <NewOrderButton
          webSocketRef={webSocketRef}
          setOrders={setOrders}
          wrapperRef={wrapperRef}
        />
      }
      <div className="my-orders-footer">
        <Pagination
          count={orders.count}
          activePageRef={activePageRef}
          updateList={updateList}
        />
      </div>
    </>
  )
}
export default MyOrders