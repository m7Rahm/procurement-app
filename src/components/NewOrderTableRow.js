import React from 'react'
import {
  FaTrashAlt,
  FaAngleDown,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
const NewOrderTableRow = (props) => {
  // const [importance, setImportance] = useState({
  //   value: 1,
  //   text: 'orta'
  // })
  const importanceText = ['orta','vacib','çox vacib']
  const updateMaterialsList = props.updateMaterialsList;
  const handleImportanceChange = (e) => {
    e.target.name = 'importance';
    handleChange(e);
  }
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '' || Number(value) > 0)
      updateMaterialsList(materials =>
        materials.map(material => material.id !== props.id ? material : ({ ...material, [name]: value }))
      )
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      updateMaterialsList(materials =>
        materials.map(material => material.id !== props.id ? material : ({ ...material, [name]: 1 }))
      )
  }
  const handleAmountChangeButtons = (action) => {
    const amoutValue = action === 'dec' ? parseInt(props.amount) - 1 : parseInt(props.amount) + 1;
    if (amoutValue > 0)
      updateMaterialsList(materials =>
        materials.map(material =>
          material.id !== props.id ? material : ({ ...material, amount: amoutValue })
        )
      )
  }
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name
    updateMaterialsList(materials =>
      materials.map(material => material.id !== props.id ? material : ({ ...material, [name]: value }))
    )
  }
  const handleRowDelete = () => {
    updateMaterialsList(materials =>
      materials.filter(material => material.id !== props.id)
    )
  }
  return (
    <tr>
      <td>{props.index + 1}</td>
      <td>
        <select onChange={handleChange} value={props.materialId}>
          <option>Notebook</option>
          <option>Hard Drive</option>
          <option>Mouse</option>
        </select>
      </td>
      <td><input type="text" placeholder="Model" value={props.model} name="model" onChange={handleChange} /></td>
      <td style={{ position: 'relative' }}>
        <div id={props.id} style={{ boxShadow: `${props.isActive ? '0px 0px 0px 1.6px royalblue' : ''}` }} className={`importance-div`}>
          {
            importanceText[props.importance - 1]
          }
          <FaAngleDown color="royalblue" />
        </div>
        <ul className={`importance-dropdown ${props.isActive ? 'importance-dropdown-visible' : ''}`}>
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
      <td>
        <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
          <FaMinus cursor="pointer" onClick={() => handleAmountChangeButtons('dec')} color="#ffae00" style={{ float: 'left', margin: '0px 3px' }} />
          <input name="amount" style={{ textAlign: 'center', padding: '0px 2px', margin: '0px 5px' }} type="text" onBlur={handleAmountFocusLose} onChange={handleAmountChange} value={props.amount} />
          <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ float: 'right', margin: '0px 3px' }} />
        </div>
      </td>
      <td><input style={{width: '100%'}}placeholder="Link və ya əlavə məlumat" name="additionalInfo" value={props.additionalInfo} type="text" onChange={handleChange} /></td>
      <td><FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" /></td>
    </tr>
  )
}
export default React.memo(NewOrderTableRow)