import React, { useRef, useEffect } from 'react'
import {
	FaPlus,
	FaTrashAlt,
	FaMinus
} from 'react-icons/fa'
const EditOrderTableRow = ({ categories, index, row, setOrderState, token, ordNumb, version, view }) => {
	const subCategoryid = row.parent_id;
	const rowid = row.id;
	const modelsRef = useRef([]);
	const codeRef = useRef(null);
	const rowRef = useRef(null);
	const modelListRef = useRef(null);
	useEffect(() => {
		const data = JSON.stringify({ categoryid: subCategoryid, ordNumb, empVersion: version })
		fetch('http://172.16.3.101:54321/api/get-budget-per-order', {
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
				setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, budget: budget, models: respJ })))
			})
	}, [subCategoryid, token, ordNumb, version, rowid, setOrderState])
	const subCategories = categories.all.filter(category => category.parent_id.toString() === row.grand_parent_id.toString());

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
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value, parent_id: 'nan' })))
	}
	const handleSubCategoryChange = (e) => {
		const value = e.target.value;
		const data = JSON.stringify({ categoryid: value, ordNumb, empVersion: version })
		fetch('http://172.16.3.101:54321/api/get-budget-per-order', {
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
				console.log(respJ)
				const budget = respJ.length !== 0 ? respJ[0].budget : 0;
				setOrderState(prev =>
					prev.map(row => row.id !== rowid
						? row
						: ({ ...row, parent_id: value, models: respJ, budget: budget, title: '', material_id: 'nan' })
					)
				)
			})
			.catch(ex => console.log(ex))
	}
	const searchByCode = (e) => {
		console.log(e.target.value)
	};
	const handleAmountChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		if (value === '' || Number(value) > 0) {
			setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value })))
		}
	}
	const handleAmountFocusLose = (e) => {
		const value = e.target.value;
		const name = e.target.name
		if (value === '')
			setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: 1 })))
	}
	const handleAmountChangeButtons = (action) => {
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, amount: action === 'inc' ? Number(row.amount) + 1 : Number(row.amount) - 1 })))
	}
	const handleChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value })))
	}
	const handleRowDelete = () => {
		if (view === 'returned') {
			rowRef.current.classList.add('delete-row');
			rowRef.current.addEventListener('animationend', () => {
				setOrderState(prev => prev.filter(row => row.id !== rowid))
			})
		}
	}
	const setModel = (model) => {
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({
			...row,
			material_id: model.id,
			approx_price: model.approx_price,
			title: model.title,
			department_name: model.department_name
		})))
		codeRef.current.value = model.product_id;
		modelListRef.current.style.display = 'none';
	}
	const handleInputSearch = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		const searchResult = modelsRef.current.filter(model => model.title.toLowerCase().includes(value));
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value, models: searchResult })))
	}
	return (
		<li ref={rowRef} className={row.className}>
			<div>{index + 1}</div>
			<div>
				<select disabled={view !== 'returned'} onChange={handleRowChange} name="grand_parent_id" value={row.grand_parent_id}>
					<option value="-1">-</option>
					{
						categories.main.map(category =>
							<option key={category.id} value={category.id}>{category.product_title}</option>
						)
					}
				</select>
			</div>
			<div>
				<select disabled={view !== 'returned'} onChange={handleSubCategoryChange} name="parent_id" value={row.parent_id}>
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
					value={row.title}
					name="title"
					disabled={view === 'protected'}
					onChange={handleInputSearch}
				/>
				<ul id={`${rowid}-modelListRef`} tabIndex="0" ref={modelListRef} className="material-model-list">
					{
						row.models.map(model =>
							<li key={model.id} onClick={() => setModel(model)}>{model.title}</li>
						)
					}
				</ul>
			</div>
			<div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
				<input
					onBlur={searchByCode}
					type="text"
					disabled={view !== 'returned'}
					ref={codeRef}
					placeholder="Kod"
					defaultValue={row.product_id}
					name="product_id"
				/>
			</div>
			<div style={{ maxWidth: '140px' }}>
				<div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
					<FaMinus cursor="pointer" onClick={() => { if (row.amount > 1 && view === 'returned') handleAmountChangeButtons('dec') }} color="#ffae00" style={{ margin: '0px 3px' }} />
					<input
						name="amount"
						disabled={view !== 'returned'}
						style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: '0px 5px', flex: 1 }}
						type="text"
						onBlur={handleAmountFocusLose}
						onChange={handleAmountChange}
						value={row.amount}
					/>
					<FaPlus cursor="pointer" onClick={() => { if (view === 'returned') handleAmountChangeButtons('inc') }} color="#3cba54" style={{ margin: '0px 3px' }} />
				</div>
			</div>
			<div>
				<div>{row.department_name}</div>
			</div>
			<div>
				<div style={{ height: '100%' }}>{row.budget}</div>
			</div>
			<div>
				<input
					style={{ width: '100%' }}
					placeholder="Link və ya əlavə məlumat"
					name="material_comment"
					disabled={view !== 'returned'}
					value={row.material_comment}
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
export default React.memo(EditOrderTableRow)