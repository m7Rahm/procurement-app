import React, { useRef, useEffect, useState, useContext } from 'react';
import Table from '../../components/Orders/MyOrders/Table'
import Pagination from '../../components/Misc/Pagination';
import {
  IoMdSearch
} from 'react-icons/io'
import { TokenContext } from '../../App'
const MyOrders = (props) => {
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const webSocketRef = useRef(props.webSocketRef.current);
  const activePageRef = useRef(0);
  const token = useContext(TokenContext)[0];
  const updateList = (from) => {
    fetch(`http://172.16.3.101:54321/api/returned-orders?from=${from}&until=20`, {
      headers: {
        'Authorization': 'Bearer ' + token,
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
    fetch(`http://172.16.3.101:54321/api/returned-orders?from=0&until=20`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
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
      <div className="wrapper" ref={wrapperRef}>
        {
          orders.count !== 0 ?
          <Table
            referer="returned"
            wrapperRef={wrapperRef}
            orders={orders}
            setOrders={setOrders}
            />
            :
            <div style={{ marginTop: '100px' }}>
              <span style={{ color: 'gray', fontSize: 30 }}>Sənəd tapılmadı</span>
              <IoMdSearch size="40" color="rgb(24, 139, 192)"/>
            </div>
        }
      </div>
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