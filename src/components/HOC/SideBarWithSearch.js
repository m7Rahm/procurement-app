import React from 'react'
import SideBar from '../Common/SideBar'
const SideBarWtihSearhBox = (SearchBoxComponent) => (props) => {
    return(
        <>
            <SearchBoxComponent/>
            <SideBar {...props}/>
        </>
    )
}