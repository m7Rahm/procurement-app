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
  const index = window.location.search.indexOf("i=")
  const orderid = index !== -1 ? window.location.search.substring(index + 2) : undefined
  const [active, setActive] = useState(Number(orderid));
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
        tranid={active}
        documentType={documentType}
      />
    </div>
  )
}
export default Visas