import React, { useRef, useState, useContext, useEffect } from 'react'
import {
  FaTrashAlt,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
import { TokenContext } from '../App';
const NewOrderTableRow = (props) => {
  const tokenContext = useContext(TokenContext);
  const rowRef = useRef(null);
  const token = tokenContext[0];
  const [rowData, setRowData] = useState({
    category: '',
    subCategory: '',
    model: '',
    models: [],
    code: '',
    value: 0,
    department: '',
    budget: 0,
    count: 1,
    id: '',
    additionalInfo: ''
  });
  const modelListRef = useRef(null);
  const modelsRef = useRef([]);
  const material = props.material;
  const mainCategories = props.categories.filter(category => category.parent_id === 34);
  const subCategories = props.categories.filter(category => category.parent_id.toString() === rowData.category.toString());
  const materialid = material.id;
  const id = rowData.id;
  const count = rowData.count;
  const subCategory = rowData.subCategory;
  const additionalInfo = rowData.additionalInfo;
  const approxPrice = rowData.value;
  const updateMaterialsList = (type, payload) => props.dispatch({ type: type, payload: payload });
  const dispatch = props.dispatch;
  useEffect(() => {
    // console.log('rerender')
    dispatch({
      type: 'updateRow', payload: {
        data: {
          model: id,
          approx_price: approxPrice,
          count: count,
          subCategory: subCategory,
          additionalInfo: additionalInfo
        }, rowid: materialid
      }
    });
  }, [
    id,
    count,
    subCategory,
    additionalInfo,
    approxPrice,
    materialid,
    dispatch
  ])
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      setRowData(prev => ({ ...prev, [name]: value }))
      // updateMaterialsList('updateRow', { data: { [name]: value }, rowid: material.id });
    }
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      setRowData(prev => ({ ...prev, [name]: 1 }))
    // updateMaterialsList('updateRow', { data: { [name]: 1 }, rowid: material.id })
  }
  const handleAmountChangeButtons = (action) => {
    setRowData(prev => ({ ...prev, count: action === 'inc' ? Number(prev.count) + 1 : Number(prev.count) - 1 }))
    // updateMaterialsList('updateRowSync', { operation: action, rowid: material.id })
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
    setRowData(prev => ({ ...prev, [name]: value }))
    // updateMaterialsList('updateRow', { data: { [name]: value }, rowid: material.id })
  }
  const handleBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'modelListRef')
      modelListRef.current.style.display = 'none'
  }
  const handleRowDelete = () => {
    rowRef.current.classList.add('delete-row');
    rowRef.current.addEventListener('animationend', () => updateMaterialsList('deleteRow', { rowid: material.id })
    )
  }
  const setModel = (model) => {
    // updateMaterialsList('updateRow', { data:  { model: model.id, approx_price : model.approx_price }, rowid: material.id });
    setRowData(prev => ({
      ...prev,
      id: model.id,
      value: model.approx_price,
      model: model.title,
      code: model.product_id,
      department: model.department_name
    }))
    modelListRef.current.style.display = 'none';
  }
  const handleInputSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === 'model') {
      const searchResult = modelsRef.current.filter(model => model.title.toLowerCase().includes(value))
      setRowData(prev => ({ ...prev, [name]: value, models: searchResult }));
    }
    // else if (name === 'code') {
    //   const searchResult = modelsRef.current.filter(model => model.title.toLowerCase().includes(value))
    //   setRowData(prev => ({ ...prev, models: searchResult }));
    // }
  }
  const searchByCode = (e) => {
    const data = { product_id: e.target.value }
    fetch('http://172.16.3.101:54321/api/get-by-product-code', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(respJ => {
        if (respJ.length !== 0) {
          const material = respJ[0];
          setRowData(prev => ({
            ...prev,
            category: material.grand_parent_id,
            subCategory: material.parent_id,
            model: material.title,
            code: material.product_id,
            value: material.approx_price,
            department: material.department_name,
            budget: material.budget,
            models: modelsRef.current.filter(model => model.id === material.id)
          }))
        }
      })
  }
  const handleSubCategoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = { categoryid: value }
    fetch('http://172.16.3.101:54321/api/strucutre-budget-info', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(respJ => {
        modelsRef.current = respJ;
        const budget = respJ.length !== 0 ? respJ[0].budget : 0;
        // updateMaterialsList('updateRow', { data: { [name]: value, materialid: '' }, rowid: material.id });
        setRowData(prev => ({ ...prev, budget: budget, [name]: value, id: '', models: respJ, model: '' }));
      })
  }
  // console.log(rowData)
  const handleRowChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRowData(prev => ({ ...prev, [name]: value }))
  }
  return (
    <li ref={rowRef} className={material.class}>
      <div>{props.index + 1}</div>
      <div>
        <select onChange={handleRowChange} name="category" value={rowData.category}>
          <option value="-1">-</option>
          {
            mainCategories.map(category =>
              <option key={category.id} value={category.id}>{category.product_title}</option>
            )
          }
        </select>
      </div>
      <div>
        <select onChange={handleSubCategoryChange} name="subCategory" value={rowData.subCategory}>
          <option value="-1">-</option>
          {
            subCategories.map(category =>
              <option key={category.id} value={category.id}>{category.product_title}</option>
            )
          }
        </select>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          onBlur={handleBlur}
          onFocus={handleFocus}
          type="text"
          placeholder="Məhsul"
          value={rowData.model}
          name="model"
          onChange={handleInputSearch}
        />
        <ul id="modelListRef" tabIndex="0" ref={modelListRef} className="material-model-list">
          {
            rowData.models.map(model =>
              <li key={model.id} onClick={() => setModel(model)}>{model.title}</li>
            )
          }
        </ul>
      </div>
      <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
        <input
          onBlur={searchByCode}
          // onFocus={handleFocus}
          type="text"
          placeholder="Kod"
          defaultValue={rowData.code}
          name="code"
        // onChange={handleInputSearch}
        />
        {/* <ul id="modelListRef" tabIndex="0" ref={modelListRef} className="material-model-list">
          {
            models.map(model =>
              <li key={model.id} onClick={() => setModel(model.title)}>{model.title}</li>
            )
          }
        </ul> */}
      </div>
      <div style={{ maxWidth: '140px' }}>
        <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
          <FaMinus cursor="pointer" onClick={() => { if (material.count > 1) handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />
          <input
            name="count"
            style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }}
            type="text"
            onBlur={handleAmountFocusLose}
            onChange={handleAmountChange}
            value={rowData.count}
          />
          <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />
        </div>
      </div>
      <div>
        <div>{rowData.department}</div>
      </div>
      <div>
        <div style={{ height: '100%' }}>{rowData.budget}</div>
      </div>
      <div>
        <input
          style={{ width: '100%' }}
          placeholder="Link və ya əlavə məlumat"
          name="additionalInfo"
          value={rowData.additionalInfo}
          type="text"
          onChange={handleChange}
        />
      </div>
      <div>
        <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
      </div>
    </li>
  )
}
export default React.memo(NewOrderTableRow)