import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
// import { visas } from '../data/data'
const Visas = (props) => {
  const [active, setActive] = useState(null);
  
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
      <SideBar webSocketRef={props.webSocketRef} active={active} setActive={setActive} />
      <VisaContent current={active} />
    </div>
  )
}
export default Visas