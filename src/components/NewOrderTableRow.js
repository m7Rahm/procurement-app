import React, { useState, useRef } from 'react'
import {
  FaTimes,
  FaAngleDown
} from 'react-icons/fa'
const NewOrderTableRow = (props) => {
  const [importance, setImportance] = useState({
    value: 1,
    text: 'orta'
  })
  const dropdownRef = useRef(null)
  // const handleImportanceVisiblityChange = (value) => {
  //   dropdownRef.current.classList.toggle('importance-dropdown-visible',value)
  // }
  const handleImportanceChange = (e) =>{
    console.log(e.target.value)
    setImportance({value: e.target.value, text: e.target.innerHTML})
  }
  return (
    <tr>
      <td>1</td>
      <td>
        <select>
          <option>Notebook</option>
          <option>Hard Drive</option>
          <option>Mouse</option>
        </select>
      </td>
      <td><input type="text" placeholder="Model" /></td>
      <td style={{ position: 'relative'}}>
          <div id={props.index} className={`importance-div`}>
          {
            importance.text
          }
          <FaAngleDown color="royalblue"/>
          </div>
          <ul className={`importance-dropdown ${props.isActive ? 'importance-dropdown-visible' : ''}`} ref={dropdownRef}>
            <li value="1" key="1" onClick={handleImportanceChange}>
              orta
            </li>
            <li title="vacib" value="2" key="2" onClick={handleImportanceChange} >
            vacib
            </li>
            <li title="çox vacib" value="3" key="3" onClick={handleImportanceChange}>
            çox vacib
            </li>
          </ul>
      </td>
      <td>50</td>
      <td><input placeholder="Link və ya əlavə məlumat" type="text"/></td>
      <td><FaTimes color="#ff4a4a"/></td>
    </tr>
  )
}
export default React.memo(NewOrderTableRow)