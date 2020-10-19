import React, { useRef, useState, useEffect } from 'react'
import {
    FaPlus,
    FaTrashAlt,
    FaMinus
} from 'react-icons/fa'
const EditOrderTableRow = ({ categories, index, row, setOrderState, token, ordNumb, version }) => {
    const [rowState, setRowState] = useState({ ...row, models: [] });
    const subCategoryid = row.parent_id;
    const rowid = row.id;
    const modelsRef = useRef([]);
    const codeRef = useRef(null)
    useEffect(() => {
        const data = { categoryid: subCategoryid, ordNumb, empVersion: version }
        fetch('http://172.16.3.101:54321/api/get-budget-per-order', {
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
                setRowState(prev => ({ ...prev, parent_id: subCategoryid, models: respJ, budget: budget }))
            })
    }, [subCategoryid, token, ordNumb, version])
    const subCategories = categories.all.filter(category => category.parent_id.toString() === rowState.grand_parent_id.toString());

    const handleBlur = (e) => {
        const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
        if (relatedTargetid === null || relatedTargetid !== `${rowid}-modelListRef`)
            modelListRef.current.style.display = 'none'
    }
    const handleFocus = () => {
        modelListRef.current.style.display = 'block'
    }
    const handleRowChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setRowState(prev => ({ ...prev, [name]: value }))
    }
    const handleSubCategoryChange = (e) => {
        const value = e.target.value;
        const data = { categoryid: value, ordNumb, empVersion: version }
        fetch('http://172.16.3.101:54321/api/get-budget-per-order', {
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
                setRowState(prev => ({ ...prev, parent_id: value, models: respJ, budget: budget, title: '' }))
            })
    }
    const modelListRef = useRef(null);
    const handleInputSearch = handleSubCategoryChange;
    const searchByCode = (e) => {
        console.log(e.target.value)
    };
    const handleChange = searchByCode;
    const handleAmountChangeButtons = searchByCode;
    const handleAmountFocusLose = searchByCode
    const handleRowDelete = searchByCode;
    const handleAmountChange = searchByCode;
    const setModel = (model) => {
        console.log(model)
        setRowState(prev => ({
            ...prev,
            id: model.id,
            value: model.approx_price,
            title: model.title,
            department_name: model.department_name
        }));
        codeRef.current.value = model.product_id;
        modelListRef.current.style.display = 'none';
    }
    console.log(rowState)
    return (
        <li>
            <div>{index + 1}</div>
            <div>
                <select onChange={handleRowChange} name="grand_parent_id" value={rowState.grand_parent_id}>
                    <option value="-1">-</option>
                    {
                        categories.main.map(category =>
                            <option key={category.id} value={category.id}>{category.product_title}</option>
                        )
                    }
                </select>
            </div>
            <div>
                <select onChange={handleSubCategoryChange} name="parent_id" value={rowState.parent_id}>
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
                    value={rowState.title}
                    name="title"
                    onChange={handleInputSearch}
                />
                <ul id={`${rowid}-modelListRef`} tabIndex="0" ref={modelListRef} className="material-model-list">
                    {
                        rowState.models.map(model =>
                            <li key={model.id} onClick={() => setModel(model)}>{model.title}</li>
                        )
                    }
                </ul>
            </div>
            <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
                <input
                    onBlur={searchByCode}
                    type="text"
                    ref={codeRef}
                    placeholder="Kod"
                    defaultValue={rowState.product_id}
                    name="product_id"
                />
            </div>
            <div style={{ maxWidth: '140px' }}>
                <div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
                    <FaMinus cursor="pointer" onClick={() => { if (rowState.count > 1) handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />
                    <input
                        name="count"
                        style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }}
                        type="text"
                        onBlur={handleAmountFocusLose}
                        onChange={handleAmountChange}
                        value={rowState.amount}
                    />
                    <FaPlus cursor="pointer" onClick={() => handleAmountChangeButtons('inc')} color="#3cba54" style={{ margin: '0px 3px' }} />
                </div>
            </div>
            <div>
                <div>{rowState.department_name}</div>
            </div>
            <div>
                <div style={{ height: '100%' }}>{rowState.budget}</div>
            </div>
            <div>
                <input
                    style={{ width: '100%' }}
                    placeholder="Link və ya əlavə məlumat"
                    name="additionalInfo"
                    value={rowState.material_comment}
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
export default EditOrderTableRow