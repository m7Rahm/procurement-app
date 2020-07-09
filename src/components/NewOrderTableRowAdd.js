import React from 'react'
import {
  IoIosAdd
} from 'react-icons/io'
const NewOrderTableRowAdd = (props) => {
  const handleClick = () => {
    props.updateMaterialsList(materials => [...materials,
    {
      id: Math.random(),
      materialId: null,
      model: '',
      importance: 1,
      amount: 1,
      additionalInfo: '',
      class: 'new-row'
    }]
    )
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
        <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleClick} size="20" style={{margin: 'auto' }} />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRowAdd)