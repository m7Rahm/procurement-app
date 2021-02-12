import React, { useCallback, useState } from 'react'
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
const checkData = (data) => {
  if(data.action === 'newOrder')
    return true;
  else
    return false;
}
const Visas = (props) => {
  const { webSocketRef } = props
  const [active, setActive] = useState(undefined);
  const updateList = useCallback((data, token) => fetch('http://192.168.0.182:54321/api/visas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': 'Bearer ' + token
    },
    body: data
  }), []);

  const sendNotification = (receivers) => {
    webSocketRef.current.send(JSON.stringify({ action: 'newOrder', people: receivers }));
  }
  return (
    <div style={{ display: 'flex', position: 'relative', top: '-56px' }}>
      <SideBar
        updateList={updateList}
        setActive={setActive}
        initData={initData}
        webSocketRef={webSocketRef}
        checkData={checkData}
      />
      <VisaContent
        tranid={active}
        sendNotification={sendNotification}
      />
    </div>
  )
}
export default Visas