import React from 'react'
import {
  IoIosAdd
} from 'react-icons/io'
import { newOrderInitial } from '../../../data/data'
const NewOrderTableRowAdd = (props) => {
  const handleClick = () => {
    props.setMaterials(prev => [...prev, {...newOrderInitial.materials[0], id: Date.now(), class: 'new-row'}])
  }
  return (
    <li style={{ height: '20px', backgroundColor: 'transparent' }}>
      <div style={{ padding: '0px' }}></div>
      <div style={{ padding: '0px' }}></div>
      <div style={{ padding: '0px' }}></div>
      <div style={{ padding: '0px' }}></div>
      <div style={{ padding: '0px' }}></div>
      <div style={{ padding: '0px' }}></div>
      <div style={{ padding: '0px' }}>
        <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleClick} size="20" style={{ margin: 'auto' }} />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRowAdd)