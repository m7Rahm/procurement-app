import React, { useRef } from 'react'
import {
  FaTrashAlt,
  FaAngleDown,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const importanceText = ['orta', 'vacib', 'çox vacib']
  const updateMaterialsList = (type, payload) => props.dispatch({ type: type, payload: payload });
  const handleImportanceChange = (e) => {
    e.target.name = 'importance';
    handleChange(e);
  }
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0)
      updateMaterialsList('updateRow', { name: name, value: value, rowid: props.id })
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
    updateMaterialsList('updateRow', { name: name, value: 1, rowid: props.id })
  }
  const handleAmountChangeButtons = (action) => {
      updateMaterialsList('updateRowSync', {operation: action, rowid: props.id})
  }
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name
    updateMaterialsList('updateRow', { name: name, value: value, rowid: props.id })
  }
  const handleRowDelete = () => {
    rowRef.current.classList.add('delete-row');
    rowRef.current.addEventListener('animationend', () => updateMaterialsList('deleteRow', { rowid: props.id })
    )
  }
  return (
    <li ref={rowRef} className={props.class}>
      <div>{props.index + 1}</div>
      <div>
        <select name="materialId" onChange={handleChange} value={props.materialId}>
          <option value={1}>Notebook</option>
          <option value={2}>Hard Drive</option>
          <option value={3}>Mouse</option>
        </select>
      </div>
      <div><input type="text" placeholder="Model" value={props.model} name="model" onChange={handleChange} /></div>
      <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
        <div id={props.id} style={{ height: '100%', textAlign: 'left', boxShadow: `${props.isActive ? '0px 0px 0px 1.6px royalblue' : ''}` }} className={`importance-div`}>
          {
            importanceText[props.importance - 1]
          }
          <FaAngleDown color="royalblue" style={{ float: 'right' }} />
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
      </div>
      <div style={{ maxWidth: '140px' }}>
        <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
          <FaMinus cursor="pointer" onClick={() => {if(props.amount > 1) handleAmountChangeButtons('dec')}} color="#ffae00" style={{ margin: '0px 3px' }} />
          <input name="amount" style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }} type="text" onBlur={handleAmountFocusLose} onChange={handleAmountChange} value={props.amount} />
          <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />
        </div>
      </div>
      <div><input style={{ width: '100%' }} placeholder="Link və ya əlavə məlumat" name="additionalInfo" value={props.additionalInfo} type="text" onChange={handleChange} /></div>
      <div><FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" /></div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)