import React, { useRef, useState, useContext } from 'react'
import {
  FaTrashAlt,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
import { TokenContext } from '../../../App';

const NewOrderTableRow = (props) => {
  const tokenContext = useContext(TokenContext);
  const rowRef = useRef(null);
  const { orderType, structure, material, dispatch, parentGlCategories, subGlCategories } = props;
  const token = tokenContext[0];
  const modelListRef = useRef(null);
  const [models, setModels] = useState([]);
  const modelsRef = useRef([]);
  const modelInputRef = useRef(null);
  const materialid = material.id;
  const updateMaterialsList = (type, payload) => dispatch({ type: type, payload: payload });
  const updateRow = (data) => dispatch({
    type: 'updateRow',
    payload: {
      data: data,
      rowid: materialid
    }
  })

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      updateRow({ [name]: value })
    }
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      updateRow({ [name]: 1 })
  }
  const handleAmountChangeButtons = (action) => {
    // setRowData(prev => ({ ...prev, count: action === 'inc' ? Number(prev.count) + 1 : Number(prev.count) - 1 }))
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
    updateRow({ [name]: value })
  }
  const handleBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'modelListRef')
      modelListRef.current.style.display = 'none'
  }
  const handleRowDelete = () => {
    rowRef.current.classList.add('delete-row');
    rowRef.current.addEventListener('animationend', () => updateMaterialsList('deleteRow', { rowid: material.id }))
  }
  const setModel = (model) => {
    updateRow({
      materialId: model.id,
      approx_price: model.approx_price,
      code: model.product_id,
      department: model.department_name
    });
    modelInputRef.current.value = model.title;
    modelListRef.current.style.display = 'none';
  }
  const handleInputSearch = (e) => {
    const value = e.target.value;
    const searchResult = modelsRef.current.filter(model => model.title.toLowerCase().includes(value));
    setModels(searchResult)
  }
  const searchByCode = (e) => {
    const data = JSON.stringify({ product_id: e.target.value, orderType: orderType, structure: structure })
    fetch('http://172.16.3.101:54321/api/get-by-product-code', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      body: data
    })
      .then(resp => resp.json())
      .then(respJ => {
        const material = respJ.length !== 0 ? respJ[0] : {}
        updateRow ({
          glCategory: material.glCategory,
          subGlCategory: material.subGlCategory,
          model: material.title,
          code: material.product_id,
          approx_price: material.approx_price,
          department: material.department_name,
          budget: material.budget,
          models: modelsRef.current.filter(model => model.id === material.id)
        })
      })
  }
  const handleSubCategoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = JSON.stringify({ subGlCategoryId: value, structureid: structure, orderType: orderType });
    fetch('http://172.16.3.101:54321/api/strucutre-budget-info', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      body: data
    })
      .then(resp => resp.json())
      .then(respJ => {
        modelsRef.current = respJ;
        const budget = respJ.length !== 0 ? respJ[0].budget : 0;
        setModels(respJ);
        updateRow({ budget: budget, [name]: value, materialId: '' })
      })
  }
  const handleRowChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    updateRow({ [name]: value })
  }
  return (
    <li ref={rowRef} className={material.class}>
      <div>{props.index + 1}</div>
      <div>
        <select onChange={handleRowChange} name="glCategory" value={material.glCategory}>
          <option value="-1">-</option>
          {
            parentGlCategories.map(category =>
              <option key={category.id} value={category.id}>{category.name}</option>
            )
          }
        </select>
      </div>
      <div>
        <select onChange={handleSubCategoryChange} name="subGlCategory" value={material.subGlCategory}>
          <option value="-1">-</option>
          {
            subGlCategories.filter(category => category.dependent_id === Number(material.glCategory)).map(category =>
              <option key={category.id} value={category.id}>{category.name}</option>
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
          ref={modelInputRef}
          name="model"
          autoComplete="off"
          onChange={handleInputSearch}
        />
        {
          <ul id="modelListRef" tabIndex="0" ref={modelListRef} style={{ outline: models.length === 0 ? '' : 'rgb(255, 174, 0) 2px solid' }} className="material-model-list">
            {
              models.map(model =>
                <li key={model.id} onClick={() => setModel(model)}>{model.title}</li>
              )
            }
          </ul>
        }
      </div>
      <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
        <input
          onBlur={searchByCode}
          type="text"
          placeholder="Kod"
          defaultValue={material.code}
          name="code"
        />
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
            value={material.count}
          />
          <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />
        </div>
      </div>
      <div>
        <div>{material.department}</div>
      </div>
      <div>
        <div style={{ height: '100%' }}>{material.budget}</div>
      </div>
      <div>
        <input
          style={{ width: '100%' }}
          placeholder="Link və ya əlavə məlumat"
          name="additionalInfo"
          value={material.additionalInfo}
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