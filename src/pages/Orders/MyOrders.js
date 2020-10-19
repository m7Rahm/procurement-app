import React, { useRef, useEffect, useState, useContext } from 'react';
import Table from '../../components/Table'
import Search from '../../components/Search'
import NewOrderButton from '../../components/NewOrderButton';
import Pagination from '../../components/Pagination';
import { UserDataContext } from '../SelectModule'
import { TokenContext } from '../../App'
const MyOrders = (props) => {
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const webSocketRef = useRef(props.webSocketRef.current);
  const activePageRef = useRef(0);
  const token = useContext(TokenContext)[0];
  const userDataContext = useContext(UserDataContext);
  const userData = userDataContext[0];
  const canCreateNewOrder = userData.previliges.includes('Sifariş yaratmaq')
  const updateList = (from) => {
    fetch(`http://172.16.3.101:54321/api/orders?from=${from}&until=20`, {
      headers: {
        'Authorization': 'Bearer ' + token
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
    fetch('http://172.16.3.101:54321/api/orders?from=0&until=20', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => {
        const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
    // if (props.webSocketRef) {
    webSocketRef.current.onmessage = (msg) => {
      
    };
    // }
  }, [token])
  return (
    <>
      <Search />
      <div className="wrapper" ref={wrapperRef}>
        <Table wrapperRef={wrapperRef} orders={orders} />
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