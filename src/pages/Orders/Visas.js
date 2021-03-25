import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import SideBar from '../../components/Common/SideBar'
import VisaContent from '../../components/Orders/Visas/VisaContent'

const initData = {
  userName: '',
  startDate: null,
  endDate: null,
  docType: -3,
  from: 0,
  until: 20
}
const Visas = () => {
  const { docid: orderid } = useParams();
  const [active, setActive] = useState(orderid);
  const updateList = useCallback((data, token) => fetch('http://192.168.0.182:54321/api/visas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': 'Bearer ' + token
    },
    body: data
  }), []);
  return (
    <div style={{ display: 'flex', position: 'relative', top: '-56px' }}>
      <SideBar
        updateList={updateList}
        setActive={setActive}
        initData={initData}
      />
      <VisaContent
        tranid={active}
      />
    </div>
  )
}
export default Visas