import React from 'react'
import {
  IoIosAdd
} from 'react-icons/io'
import shortId from 'shortid'
const NewOrderTableRowAdd = (props) => {
  const handleClick = () => {
    props.updateMaterialsList(materials => [...materials,
    {
      id: shortId.generate(),
      materialId: null,
      model: '',
      importance: 1,
      amount: 1,
      additionalInfo: ''
    }]
    )
  }
  return (
    <tr style={{ height: '20px', backgroundColor: 'transparent' }}>
      <td style={{ padding: '0px' }}></td>
      <td style={{ padding: '0px' }}></td>
      <td style={{ padding: '0px' }}></td>
      <td style={{ padding: '0px' }}></td>
      <td style={{ padding: '0px' }}></td>
      <td style={{ padding: '0px' }}></td>
      <td style={{ padding: '0px' }}>
        <IoIosAdd title="Əlavə et" cursor="pointer" onClick={handleClick} size="20" style={{margin: 'auto' }} />
      </td>
    </tr>
  )
}
export default React.memo(NewOrderTableRowAdd)