import React, { useRef, useState } from 'react'
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';

const NewOrderTableRow = (props) => {
  const rowRef = useRef(null);
  const { orderType, structure, material, subGlCategories, setMaterials } = props;
  const modelListRef = useRef(null);
  const [models, setModels] = useState([]);
  const modelsRef = useRef([]);
  const modelInputRef = useRef(null);
  const materialid = material.id;
  const [budget, setBudget] = useState(0);
  const timeoutRef = useRef(null);
  const codeRef = useRef(null);
  const fetchGet = useFetch("GET");
  const fetchPost = useFetch("POST")
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (value === '' || Number(value) > 0) {
      setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
    }
  }
  const handleAmountFocusLose = (e) => {
    const value = e.target.value;
    const name = e.target.name
    if (value === '')
      setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: 0 } : material))
  }
  const handleAmountChangeButtons = (action) => {
    setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, count: action === 'inc' ? material.count + 1 : material.count - 1 } : material))
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
    setMaterials(prev => prev.map(material => material.id === materialid ? { ...material, [name]: value } : material))
  }
  const handleBlur = (e) => {
    const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
    if (relatedTargetid === null || relatedTargetid !== 'modelListRef')
      modelListRef.current.style.display = 'none'
  }
  const handleRowDelete = () => {
    rowRef.current.classList.add("delete-row");
    rowRef.current.addEventListener('animationend', () => setMaterials(prev => prev.filter(material => material.id !== materialid)))
  }
  const setModel = (model) => {
    setMaterials(prev => prev.map(material => material.id === materialid
      ? {
        ...material,
        subGlCategory: model.sub_gl_category_id,
        materialId: model.id,
        approx_price: model.approx_price,
        code: model.product_id,
        department: model.department_name,
        isService: model.is_service
      }
      : material
    ));
    setBudget(model.budget)
    codeRef.current.value = model.product_id;
    modelInputRef.current.value = model.title;
    modelListRef.current.style.display = "none";
  }
  const handleInputSearch = (e) => {
    const value = e.target.value;
    if (material.subGlCategory !== "-1" && material.subGlCategory !== undefined && material.subGlCategory !== "") {
      const searchResult = modelsRef.current.filter(model => model.title.toLowerCase().includes(value));
      setModels(searchResult);
    } else {
      fetchGet(`http://192.168.0.182:54321/api/material-by-title?title=${value}&orderType=${orderType}&structure=${structure}`)
        .then(respJ => setModels(respJ))
        .catch(ex => console.log(ex))
    }
  }
  const searchByCode = (e) => {
    const data = { product_id: e.target.value, orderType: orderType, structure: structure };
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      fetchPost('http://192.168.0.182:54321/api/get-by-product-code', data)
        .then(respJ => {
          timeoutRef.current = null;
          if (respJ.length === 1) {
            const material = respJ.length !== 0 ? respJ[0] : {};
            modelInputRef.current.value = material.title || "";
            setMaterials(prev => prev.map(prevMaterial => prevMaterial.id === materialid
              ? {
                ...prevMaterial,
                subGlCategory: material.subGlCategory,
                code: material.product_id,
                approx_price: material.approx_price,
                department: material.department_name,
                materialId: material.id,
                models: modelsRef.current.filter(model => model.sub_gl_category_id === material.subGlCategory),
                isService: material.is_service
              }
              : prevMaterial
            ));
            setBudget(_ => material.budget || 0);
            modelListRef.current.style.display = "none";
          } else {
            modelListRef.current.style.display = "block";
            setModels(respJ);
          }
        })
        .catch(ex => {
          console.log(ex);
          timeoutRef.current = null;
        })
    }, 500)
  }
  const handleSubCategoryChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = { subGlCategoryId: value, structureid: structure, orderType: orderType };
    fetchPost('http://192.168.0.182:54321/api/strucutre-budget-info', data)
      .then(respJ => {
        modelsRef.current = respJ;
        const budget = respJ.length !== 0 ? respJ[0].budget : 0;
        setModels(respJ);
        setBudget(budget);
        modelInputRef.current.value = "";
        codeRef.current.value = ""
        setMaterials(prev => prev.map(material =>
          material.id === materialid
          ? { ...material, [name]: value, materialId: '', department: "", isService: orderType }
          : material
        ))
      })
      .catch(ex => console.log(ex))
  }
  return (
    <li ref={rowRef} className={material.class}>
      <div>{props.index + 1}</div>
      <div>
        <select onChange={handleSubCategoryChange} name="subGlCategory" value={material.subGlCategory}>
          <option value="-1">-</option>
          {
            subGlCategories.map(category =>
              <option key={category.id} value={category.id}>{`${category.code} ${category.name}`}</option>
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
          onChange={searchByCode}
          type="text"
          placeholder="Kod"
          ref={codeRef}
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
        <div style={{ height: '100%' }}>{budget}</div>
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