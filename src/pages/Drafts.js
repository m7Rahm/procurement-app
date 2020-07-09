import React from 'react'
import SideBar from '../components/SideBar'
const Drafts = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'steelblue' }}>
            <SideBar visas={[]} active={null} setActive={null} />
        </div>
    )
}
export default Drafts