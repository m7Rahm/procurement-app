import React, { useRef, useState } from 'react'
import {
  FaTrashAlt,
  FaAngleDown,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const [modelsList, setModelsList] = useState([]);
  const importanceText = ['orta', 'vacib', 'çox vacib'];
  const modelListRef = useRef(null);
  const modelsRef = useRef([])
  const updateMaterialsList = (type, payload) => props.dispatch({ type: type, payload: payload });
  const handleImportanceChange = (e) => {
    e.target.name = 'importance';
    handleChange(e);
  }
  console.log(modelsList)
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
    updateMaterialsList('updateRowSync', { operation: action, rowid: props.id })
  }
  const handleFocus = () => {
    if (props.modelsListRef.current)
      props.modelsListRef.current.style.display = 'none';
    modelListRef.current.style.display = 'block'
    props.modelsListRef.current = modelListRef.current;
  }
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    updateMaterialsList('updateRow', { name: name, value: value, rowid: props.id })

  }
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value !== 'add-new') {
      const data = {
        materialid: value
      }
      fetch(`http://172.16.3.101:54321/api/get-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': JSON.stringify(data).length
        },
        body: JSON.stringify(data)
      })
        .then(resp => resp.json())
        .then(respJ => {
          modelsRef.current = respJ;
          setModelsList(respJ)
        })
        .catch(ex => console.log(ex))
      updateMaterialsList('updateRow', { name: name, value: value, rowid: props.id })
    }
    else {
      props.setSysParamsModalState(true)
    }
  }
  const handleBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'modelListRef')
      modelListRef.current.style.display = 'none'
  }
  const handleRowDelete = () => {
    rowRef.current.classList.add('delete-row');
    rowRef.current.addEventListener('animationend', () => updateMaterialsList('deleteRow', { rowid: props.id })
    )
  }
  const setModel = (value) => {
    updateMaterialsList('updateRow', { name: 'model', value: value, rowid: props.id });
    modelListRef.current.style.display = 'none';
  }
  const handleInputSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const searchResult = modelsRef.current.filter(model => model.title.toLowerCase().includes(value))
    setModelsList(searchResult);
    updateMaterialsList('updateRow', { name: name, value: value, rowid: props.id });
  }
  return (
    <li ref={rowRef} className={props.class}>
      <div>{props.index + 1}</div>
      <div>
        <select name="materialId" onChange={handleCategoryChange} value={props.materialId}>
          {
            props.materials.map(material =>
              <option key={material.id} value={material.id}>{material.product_title}</option>
            )
          }
          <option value="add-new">Yeni Material</option>
        </select>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder="Model"
          value={props.model}
          name="model"
          onChange={handleInputSearch}
        />
        <ul id="modelListRef" tabIndex="0" ref={modelListRef} className="material-model-list">
          {
            modelsList.map(model =>
              <li key={model.id} onClick={() => setModel(model.title)}>{model.title}</li>
            )
          }
        </ul>
      </div>
      <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
        <div id={props.id} style={{ height: '100%', textAlign: 'left', boxShadow: `${props.isActive ? '0px 0px 0px 1.6px royalblue' : ''}` }} className={`importance-div`}>
          {importanceText[props.importance - 1]}
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
          <FaMinus cursor="pointer" onClick={() => { if (props.amount > 1) handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />
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