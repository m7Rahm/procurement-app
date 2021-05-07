import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import Table from '../../components/Orders/MyOrders/Table'
import Search from '../../components/Search/Search'
import NewOrderButton from '../../components/Orders/NewOrder/NewOrderButton';
import Pagination from '../../components/Misc/Pagination';
import { TokenContext } from '../../App'
import useFetch from '../../hooks/useFetch';
import ResultEmpty from '../../components/Common/ResultEmpty';
import ContentLoading from '../../components/Misc/ContentLoading';
const MyOrders = (props) => {
  const { referer, method, link, inParams, inLink } = props
  const wrapperRef = useRef(null);
  const [orders, setOrders] = useState({ count: 0, orders: [] });
  const activePageRef = useRef(0);
  const tokenContext = useContext(TokenContext);
  const userData = tokenContext[0].userData;
  const canCreateNewOrder = userData.previliges.includes('Sifariş yaratmaq');
  const canSeeOtherOrders = userData.previliges.includes("Digər sifarişləri görmək")
  const fetchPost = useFetch("POST");
  const fetchGet = useFetch("GET");
  const fetchFunc = useCallback((data) => method === "GET" ? fetchGet(data) : fetchPost(link, data), [link, method, fetchGet, fetchPost])
  const searchRefData = useRef(inParams)
  const initLink = method === "GET" ? inLink(0) : ""
  const [loading, setLoading] = useState(true);
  const updateList = (from) => {
    const data = method === "GET" ? inLink(from) : { ...searchRefData.current, from: from, until: 20, canSeeOtherOrders };
    fetchFunc(data)
      .then(respJ => {
        const totalCount = respJ[0] ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
        setLoading(false)
      })
      .catch(err => console.log(err))
  }
  const index = window.location.search.indexOf("i=")
  const orderid = index !== -1 ? window.location.search.substring(index + 2) : undefined
  useEffect(() => {
    const data = method === "GET" ? initLink : {
      from: 0,
      until: 20,
      status: -3,
      dateFrom: '',
      dateTill: '',
      ordNumb: "",
      id: Number(orderid),
      canSeeOtherOrders,
      departments: []
    };
    fetchFunc(data)
      .then(respJ => {
        const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
        setOrders({ count: totalCount, orders: respJ });
        setLoading(false)
      })
      .catch(err => console.log(err))
  }, [fetchFunc, link, method, initLink, canSeeOtherOrders, orderid])
  return (
    <div style={{ paddingBottom: '66px', paddingTop: "56px" }}>
      {
        referer === "protected" &&
        <Search
          canSeeOtherOrders={canSeeOtherOrders}
          searchRefData={searchRefData}
          updateList={updateList}
          setLoading={setLoading}
        />
      }
      <div className="wrapper" ref={wrapperRef}>
        {
          loading ?
            <ContentLoading />
            : orders.orders.length !== 0
              ? <Table
                wrapperRef={wrapperRef}
                orders={orders}
                referer={referer}
                setOrders={setOrders}
              />
              : <ResultEmpty />
        }
      </div>
      {
        canCreateNewOrder && referer === "protected" &&
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