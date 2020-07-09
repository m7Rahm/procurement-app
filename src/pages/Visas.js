import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
import {visas} from '../data/data'
const Visas = () => {
const [active, setActive] = useState(1);
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <SideBar visas={visas} active={active} setActive={setActive} />
      <VisaContent current={active}/>
    </div>
  )
}
export default Visas