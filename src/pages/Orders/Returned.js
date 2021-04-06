import React, { useRef, useEffect, useState } from 'react';
import Table from '../../components/Orders/MyOrders/Table'
import Pagination from '../../components/Misc/Pagination';
import {
  IoMdSearch
} from 'react-icons/io'
import useFetch from '../../hooks/useFetch';
const Returned = () => {
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const activePageRef = useRef(0);
  const fetchGet = useFetch("GET");
  const updateList = (from) => {
    fetchGet(`http://192.168.0.182:54321/api/returned-orders?from=${from}&until=20`)
      .then(respJ => {
        const totalCount = respJ[0] ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    fetchGet(`http://192.168.0.182:54321/api/returned-orders?from=0&until=20`)
      .then(respJ => {
        const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
  }, [fetchGet])
  return (
    <>
      <div className="wrapper" style={{ paddingTop: "56px" }} ref={wrapperRef}>
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
              <IoMdSearch size="40" color="rgb(24, 139, 192)" />
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
export default Returned