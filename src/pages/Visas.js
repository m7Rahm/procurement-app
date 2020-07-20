import React, { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
import { visas } from '../data/data'
const Visas = (props) => {
  const [active, setActive] = useState(1);
  useEffect(() => {
    //todo: create socket and connect
    if (props.webSocketRef) {
      props.webSocketRef.onmessage = (msg) => console.log(`${msg} \nfrom VISAS page`);
      console.log(props.webSocketRef);
    }
  }, [props.webSocketRef])
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <SideBar docs={visas} active={active} setActive={setActive} />
      <VisaContent current={active} />
      <div onClick={() => {
        setActive(12);
        props.webSocketRef.send(JSON.stringify({
          action: "recognition",
          person: 73
        }))
      }}>ASFS</div>
    </div>
  )
}
export default Visas