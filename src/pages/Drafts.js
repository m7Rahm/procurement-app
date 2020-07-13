import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import NewOrderContent from '../components/modal content/NewOrder';
import {visas} from '../data/data.js'
const Drafts = () => {
const [active, setActive] = useState(1);
// const NewComponent = () => <NewOrderContent current={active}/>
    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'transparent' }}>
            <SideBar docs={visas} active={active} setActive={setActive} />
            <div style={{ flex: 1, background: 'transparent', height: '100vh', overflow: 'auto', paddingTop: '56px', textAlign: 'center' }}>
            <NewOrderContent current={active}/>
            </div>
        </div>
    )
}
export default Drafts