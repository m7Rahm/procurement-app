import React, { useCallback, useState } from 'react'
import SideBar from '../../components/Common/SideBar'
import VisaContent from '../../components/Orders/Visas/VisaContent'
import useFetch from '../../hooks/useFetch'

const initData = {
  userName: '',
  startDate: null,
  endDate: null,
  docType: -3,
  from: 0,
  until: 20
}
const documentType = 10
const Visas = () => {
  const oIndex = window.location.search.match(/i=(\d+)&?/)
  const orderid = oIndex ? oIndex[1] : undefined
  const rIndex = window.location.search.match(/r=(\d+)&?/)
  const initid = rIndex ? rIndex[1] : undefined
  const [active, setActive] = useState({ orderid: orderid, initid: initid });
  const fetchPost = useFetch("POST");
  const updateList = useCallback((data) => fetchPost('http://192.168.0.182:54321/api/visas', data), [fetchPost]);
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <SideBar
        updateList={updateList}
        setActive={setActive}
        initData={initData}
      />
      <VisaContent
        tranid={active.orderid}
        initid={active.initid}
        documentType={documentType}
      />
    </div>
  )
}
export default Visas