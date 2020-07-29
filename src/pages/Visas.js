import React, { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
// import { visas } from '../data/data'
const Visas = (props) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    //todo: create socket and connect
    if (props.webSocketRef) {
      props.webSocketRef.onmessage = (msg) => console.log(`${msg} \nfrom VISAS page`);
    }
  }, [props.webSocketRef])
  return (
    <div style={{ maxHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      <SideBar active={active} setActive={setActive} />
      <VisaContent current={active} />
    </div>
  )
}
export default Visas