import React, { useRef, useEffect, useState, useContext } from 'react';
import Table from '../../components/Orders/MyOrders/Table'
import Search from '../../components/Search/Search'
import NewOrderButton from '../../components/Orders/NewOrder/NewOrderButton';
import Pagination from '../../components/Misc/Pagination';
import { TokenContext } from '../../App'
import { useParams } from 'react-router';
import useFetch from '../../hooks/useFetch';
const MyOrders = () => {
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const activePageRef = useRef(0);
  const tokenContext = useContext(TokenContext);
  const userData = tokenContext[0].userData;
  const canCreateNewOrder = userData.previliges.includes('Sifariş yaratmaq');
  const { docid: orderid } = useParams();
  const fetchOrders = useFetch("POST");
  const [searchData, setSearchData] = useState({
    dateFrom: '',
    dateTill: '',
    status: -3,
    date: '',
    ordNumb: ""
  });
  const updateList = (from) => {
    const data = { ...searchData, from: from, until: 20 };
    fetchOrders(`http://192.168.0.182:54321/api/orders`, data)
      .then(respJ => {
        const totalCount = respJ[0] ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    const data = {
      from: 0,
      until: 20,
      status: -3,
      dateFrom: '',
      dateTill: '',
      ordNumb: "",
      id: orderid
    };
    //todo: create socket and connect
    fetchOrders(`http://192.168.0.182:54321/api/orders`, data)
      .then(respJ => {
        const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
      })
      .catch(err => console.log(err))
  }, [fetchOrders, orderid])
  return (
    <div style={{ paddingBottom: '66px', paddingTop: "56px" }}>
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
    </div>
  )
}
export default MyOrders