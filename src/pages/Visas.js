import React, { useState, useCallback } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
// import { visas } from '../data/data'
const Visas = (props) => {
  const [active, setActive] = useState(null);
  const onMountFunction = useCallback((setVisas, notifIcon) => {
    const data = {
      userName: '',
      deadline: '',
      startDate: null,
      endDate: null,
      docType: 0,
      from: 0,
      until: 20
    }
    fetch('http://172.16.3.101:54321/api/visas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(respJ => setVisas(respJ))
      .catch(err => console.log(err))
    props.webSocketRef.current.onmessage = (msg) => {
      // console.log(msg)
      const data = JSON.parse(msg.data);
      if (data.action === 'newOrder') {
        notifIcon.current.style.display = 'block';
      }
    }
  }, [props.webSocketRef])

  // useEffect(() => {
  //   //todo: create socket and connect
  //   // if (props.webSocketRef) {
  //     webSocketRef.current.onmessage = (msg) => {
  //       if(msg.action === 'newOrder')
  //     };
  //   // }
  // }, []);
  // console.log(active);
  return (
    <div style={{ maxHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      <SideBar mountFunc={onMountFunction} setActive={setActive} />
      <VisaContent current={active} />
    </div>
  )
}
export default Visas