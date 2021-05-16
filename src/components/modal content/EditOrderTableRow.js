import React, { useRef, useEffect } from "react"
import {
	FaPlus,
	FaTrashAlt,
	FaMinus
} from "react-icons/fa"
import useFetch from "../../hooks/useFetch";
const EditOrderTableRow = ({ glCategories, index, row, setOrderState, ordNumb, version, view, glCatid, orderType, structure }) => {
	const { sub_gl_category_id: subCategoryid } = row;
	const rowid = row.id;
	const modelsRef = useRef([]);
	const codeRef = useRef(null);
	const rowRef = useRef(null);
	const modelListRef = useRef(null);
	const timeoutRef = useRef(null);
	const modelInputRef = useRef(null)
	const fetchPost = useFetch("POST");
	useEffect(() => {
		if (view === "returned" || view === "procurement") {
			const data = { categoryid: subCategoryid, ordNumb, empVersion: version }
			fetchPost("http://192.168.0.182:54321/api/get-budget-per-order", data)
				.then(respJ => {
					modelsRef.current = respJ;
					const budget = respJ.length !== 0 ? respJ[0].budget : 0;
					setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, budget: budget, models: respJ })))
				})
		}
	}, [subCategoryid, fetchPost, ordNumb, version, rowid, setOrderState, view])
	const subCategories = glCategories.all.filter(category => category.dependent_id === Number(glCatid));
	useEffect(() => {
		if (view === "returned") {
			const data = { subGlCategoryId: subCategoryid, structureid: structure, orderType: orderType };
			fetchPost('http://192.168.0.182:54321/api/strucutre-budget-info', data)
				.then(respJ => {
					modelsRef.current = respJ;
					const budget = respJ.length !== 0 ? respJ[0].budget : 0;
					const modelInput = modelInputRef.current.value.toLowerCase();
					setOrderState(prev => prev.map(row => row.id !== rowid
						? row
						: ({
							...row,
							sub_gl_category_id: subCategoryid,
							models: respJ.filter(model => model.title.toLowerCase().includes(modelInput)),
							budget: budget,
						})
					))
				})
				.catch(ex => console.log(ex))
		}
	}, [subCategoryid, fetchPost, orderType, structure, view, rowid, setOrderState])
	const handleBlur = (e) => {
		const relatedTargetid = e.relatedTarget ? e.relatedTarget.id : null
		if (relatedTargetid === null || relatedTargetid !== `${rowid}-modelListRef`)
			modelListRef.current.style.display = "none"
	}
	const handleFocus = () => {
		modelListRef.current.style.display = "block"
	}
	const handleSubCategoryChange = (e) => {
		const value = e.target.value;
		const data = { categoryid: value, ordNumb, empVersion: version }
		fetchPost("http://192.168.0.182:54321/api/get-budget-per-order", data)
			.then(respJ => {
				modelsRef.current = respJ;
				const budget = respJ.length !== 0 ? respJ[0].budget : 0;
				setOrderState(prev => prev.map(row => row.id !== rowid
					? row
					: ({ ...row, sub_gl_category_id: value, models: respJ, budget: budget, title: "", material_id: "NaN" })
				))
			})
			.catch(ex => console.log(ex))
	}
	const searchByCode = (e) => {
		const data = { product_id: e.target.value, orderType: orderType, structure: structure };
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		timeoutRef.current = setTimeout(() => {
			fetchPost("http://192.168.0.182:54321/api/get-by-product-code", data)
				.then(respJ => {
					timeoutRef.current = null;
					if (respJ.length !== 0) {
						const updatedRow = respJ.length === 1
							? {
								sub_gl_category_id: respJ[0].subGlCategory,
								models: respJ,
								budget: respJ[0].budget,
								title: respJ[0].title,
								material_id: respJ[0].id,
								isAmortisized: respJ[0].is_amortisized,
								department_name: respJ[0].department_name
							}
							: { models: respJ, title: "", material_id: "NaN" }
						if (respJ.length === 1) {
							modelListRef.current.style.display = "none";
						} else if (respJ.length > 1) {
							modelListRef.current.style.display = "block";
						}
						setOrderState(prev => prev.map(row => row.id !== rowid
							? row
							: ({ ...row, ...updatedRow })
						));
					}
				})
				.catch(ex => {
					console.log(ex);
					timeoutRef.current = null;
				})
		}, 500)
	};
	const handleAmountChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		if (value === "" || Number(value) > 0) {
			setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value })))
		}
	}
	const handleAmountFocusLose = (e) => {
		const value = e.target.value;
		const name = e.target.name
		if (value === "")
			setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: 1 })))
	}
	const handleAmountChangeButtons = (action) => {
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, amount: action === "inc" ? Number(row.amount) + 1 : Number(row.amount) - 1 })))
	}
	const handleChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value })))
	}
	const handleRowDelete = () => {
		if (view === "returned") {
			rowRef.current.classList.add("delete-row");
			rowRef.current.addEventListener("animationend", () => {
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
			department_name: model.department_name,
			budget: model.budget,
			sub_gl_category_id: model.sub_gl_category_id,
			isAmortisized: model.is_amortisized,
			perc: model.perc
		})))
		codeRef.current.value = model.product_id;
		modelListRef.current.style.display = "none";
	}
	const handleInputSearch = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		const charArray = value.split("")
		const reg = charArray.reduce((conc, curr) => conc += `${curr}(.*)`, "")
		const regExp = new RegExp(`${reg}`, "i");
		const searchResult = modelsRef.current.filter(model => regExp.test(model.title))
		setOrderState(prev => prev.map(row => row.id !== rowid ? row : ({ ...row, [name]: value, models: searchResult })))
	}
	return (
		<li ref={rowRef} className={row.className}>
			<div>{index + 1}</div>
			<div>
				<select disabled={view !== "returned"} onChange={handleSubCategoryChange} name="sub_gl_category_id" value={row.sub_gl_category_id}>
					<option value="-1">-</option>
					{
						subCategories.map(category =>
							<option key={category.id} value={category.id}>{category.name}</option>
						)
					}
				</select>
			</div>
			<div style={{ position: "relative" }}>
				<input
					onBlur={handleBlur}
					onFocus={handleFocus}
					type="text"
					placeholder="Məhsul"
					value={row.title}
					name="title"
					autoComplete="off"
					ref={modelInputRef}
					disabled={view === "protected"}
					onChange={handleInputSearch}
				/>
				<ul id={`${rowid}-modelListRef`} tabIndex="0" ref={modelListRef} className="material-model-list">
					{
						row.models.map(model => {
							const titleArr = model.title.split("");
							const inputVal = modelInputRef.current.value;
							const title = <>{titleArr.map((char, index) => {
								const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
								if (strRegExp.test(char))
									return <i key={index}>{char}</i>
								else {
									return char
								}
							})
							}</>
							return <li key={model.id} onClick={() => setModel(model)}>{title}</li>
						})
					}
				</ul>
			</div>
			<div style={{ position: "relative", width: "170px", maxWidth: "200px" }}>
				<input
					onChange={searchByCode}
					type="text"
					disabled={view !== "returned"}
					ref={codeRef}
					placeholder="Kod"
					defaultValue={row.product_id}
					name="product_id"
				/>
			</div>
			<div style={{ maxWidth: "140px" }}>
				<div style={{ backgroundColor: "transparent", padding: "0px 15px" }}>
					<FaMinus cursor="pointer" onClick={() => { if (row.amount > 1 && view === "returned") handleAmountChangeButtons("dec") }} color="#ffae00" style={{ margin: "0px 3px" }} />
					<input
						name="amount"
						disabled={view !== "returned"}
						style={{ width: "40px", textAlign: "center", padding: "0px 2px", margin: "0px 5px", flex: 1 }}
						type="text"
						onBlur={handleAmountFocusLose}
						onChange={handleAmountChange}
						value={row.amount}
					/>
					<FaPlus cursor="pointer" onClick={() => { if (view === "returned") handleAmountChangeButtons("inc") }} color="#3cba54" style={{ margin: "0px 3px" }} />
				</div>
			</div>
			<div>
				<div>{row.department_name}</div>
			</div>
			<div>
				{row.budget}
			</div>
			<div>
				<input
					style={{ width: "100%" }}
					placeholder="Link və ya əlavə məlumat"
					name="material_comment"
					disabled={view !== "returned"}
					value={row.material_comment || ""}
					type="text"
					onChange={handleChange}
				/>
			</div>
			<div>
				{view === "returned" &&
					<FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
				}
			</div>
		</li>
	)
}
export default React.memo(EditOrderTableRow)