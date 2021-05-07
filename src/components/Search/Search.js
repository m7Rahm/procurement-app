import React, { useEffect, useRef, useState } from "react"
import { FaTimes } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
const Search = (props) => {
	const { updateList, searchRefData } = props
	const [departments, setDepartments] = useState([])
	const departmentRef = useRef([])
	const structuresInputRef = useRef(null);
	const [selectedDepartments, setSelectedDepartments] = useState([])
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		searchRefData.current[name] = value
	}
	const handleStructureSelect = (department) => {
		setSelectedDepartments(prev => {
			let newState = []
			if (prev.find(str => str.id === department.id)) {
				newState = prev
				searchRefData.current.departments = newState
				return newState
			} else {
				newState = [...prev, department]
				searchRefData.current.departments = newState
				return newState
			}
		})
	}
	const handleStructureInputBlur = (e) => {
		const relatedTarget = e.relatedTarget
		if (relatedTarget && relatedTarget.classList.contains("structure-dep")) {
			relatedTarget.click()
		}
	}
	const removeFromSelected = (department) => {
		setSelectedDepartments(prev => {
			const newState = prev.filter(dep => dep.id !== department.id)
			searchRefData.current.departments = newState;
			return newState
		})
	}
	const handleStructureChange = (e) => {
		const value = e.target.value;
		const charArray = value.split("")
		const reg = charArray.reduce((conc, curr) => conc += curr !== "\\" ? curr + "(.*)" : curr + "\\(.*)", "")
		const regExp = new RegExp(reg, "i")
		setDepartments(departmentRef.current.filter(department => regExp.test(department.name)))
	}
	const handleSearch = () => {
		updateList(0)
	}
	const fetchGet = useFetch("GET");
	useEffect(() => {
		fetchGet("http://192.168.0.182:54321/api/departments")
			.then(resp => {
				departmentRef.current = resp;
				setDepartments(resp)
			})
			.catch(ex => console.log(ex))
	}, [fetchGet])
	return (
		<>
			<div style={{ backgroundColor: "#188bc0" }}>
				<div className="wrapper">
					<div className="search-container">
						<div>
							<label htmlFor="status">Status</label>
							<br />
							<select name="status" onChange={handleChange} style={{ height: "35px", float: "left" }}>
								<option value="-3">-</option>
								<option value="-1">Etiraz</option>
								{/* <option value="1">Təsdiq edilmiş</option> */}
								<option value="77">Gözlənilir</option>
								<option value="0">Baxılır</option>
								<option value="99">Tamamlanmış</option>
							</select>
						</div>
						<div>
							<label htmlFor="dateFrom">Başlanğıc</label>
							<br />
							<input
								onChange={handleChange}
								placeholder="Tarix"
								name="dateFrom"
								type="date"
								style={{ height: "35px", float: "left" }}
							/>
						</div>
						<div>
							<label htmlFor="dateTill">Son</label>
							<br />
							<input
								onChange={handleChange}
								placeholder="Tarix"
								name="dateTill"
								type="date"
								style={{ height: "35px", float: "left" }}
							/>
						</div>
						{
							props.canSeeOtherOrders &&
							<div style={{ position: "relative" }}>
								<label htmlFor="dateTill">Struktur</label>
								<br />
								<input
									onChange={handleStructureChange}
									placeholder="Struktur"
									name="structure"
									autoComplete="off"
									onBlur={handleStructureInputBlur}
									type="text"
									ref={structuresInputRef}
									style={{ height: "35px", float: "left" }}
								/>
								<ul className="structures-list">
									{
										departments.map(department => {
											const titleArr = department.name.split("");
											const inputVal = structuresInputRef.current.value;
											const title = <>{
												titleArr.map((char, index) => {
													const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
													if (strRegExp.test(char))
														return <i key={index}>{char}</i>
													else {
														return char
													}
												})
											}
											</>
											return <li tabIndex="3" className="structure-dep" key={department.id} onClick={() => handleStructureSelect(department)}>{title}</li>
										})
									}
								</ul>
							</div>
						}
						<div>
							<label htmlFor="ordNumb" >Nömrə</label>
							<br />
							<input
								onChange={handleChange}
								placeholder="Nömrə"
								name="ordNumb"
								type="text"
								style={{ height: "35px", float: "left" }}
							/>
						</div>
						<div style={{ textAlign: "left", height: "55px", display: "flex", minWidth: "180px", flexDirection: "column-reverse" }}>
							<button
								onClick={handleSearch}
								style={{
									height: "35px",
									marginBottom: "1.5px",
									cursor: "pointer",
									color: "white",
									fontWeight: "600",
									padding: "3px 6px",
									float: "left",
									minWidth: "180px",
									fontFamily: "sans-serif",
									border: "none",
									backgroundColor: "#ffae00"
								}}>
								AXTAR
						</button>
						</div>
					</div>
				</div>
			</div>
			<div style={{ overflow: "hidden" }}>{
				selectedDepartments.map(department =>
					<div className="sel-dep-list" key={department.id}>
						{department.name}
						<FaTimes cursor="pointer" onClick={() => removeFromSelected(department)} style={{ float: "right", marginLeft: "6px" }} />
					</div>
				)
			}
			</div>
		</>
	)
}
export default Search