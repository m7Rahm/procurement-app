import React, { useState, useRef, useEffect } from 'react'
import VisaForwardPerson from './VisaForwardPerson'

const InputWithSearch = (props) => {
	const [receivers, setReceivers] = useState([]);
	const [searchKey, setSearchKey] = useState('');
	// const empListRef = useRef(null);
	const current = props.current;
	const empVersion = props.empVersion;
	useEffect(() => {
		if(props.isDraft)
		fetch(`http://172.16.3.101:54321/api/participants/${current}?type=2&empVersion=${empVersion}`)
		  .then(resp => resp.json())
		  .then(respJ => setReceivers(respJ)
		  )
		  .catch(err => console.log(err))
	  }, [current, empVersion, props.isDraft])
	const [empListState, setEmpListState] = useState(() => props.empListRef.current);
	const wrapperRef = useRef(null);
	const handleSelectChange = (employee) => {
		const res = receivers.find(emp => emp.id === employee.id);
		const newReceivers = !res ? [...receivers, employee] : receivers.filter(emp => emp.id !== employee.id);
		props.receiversRef.current = newReceivers;
		setReceivers(newReceivers);
		setSearchKey('');
	}
	const displayList = () => {
		wrapperRef.current.style.overflow = 'visible';
	}
	const handleSearch = (e) => {
		const str = e.target.value.toLowerCase();
		const searchResult = props.empListRef.current.filter(emp => emp.full_name.toLowerCase().includes(str));
		setSearchKey(str);
		setEmpListState(searchResult);
	}
	useEffect(() => {
		const handleOnOuterClick = (e) => {
			const target = e.target.closest('div');

			if (target.id !== 'emp-list-container' && target.id !== 'emp-list-upper' && wrapperRef.current.style.overflow === 'visible') {
				wrapperRef.current.style.overflow = 'hidden';
			}
		}
		document.addEventListener('click', handleOnOuterClick, false);
		return () => document.removeEventListener('click', handleOnOuterClick, false)
	}, []);
	return (
		<>
			<div className="forwarded-person">
				<label htmlFor="forwardedPerson">Rəy üçün yönəlt</label>
				<br />
				<div id="emp-list-container" ref={wrapperRef} onClick={displayList}>
					<div id="emp-list-upper">
						<input className="search-with-query" type="text" placeholder="İşçinin adını daxil edin.." value={searchKey} onChange={handleSearch}></input>
					</div>
					<ul className="employees-list">
						{
							empListState.map(employee =>
								<li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee)}>
									{employee.full_name}
								</li>
							)
						}
					</ul>
				</div>
			</div>
			<div>
				<div>
					{
						receivers.map(emp => <VisaForwardPerson key={Math.random()} emp={emp} handleSelectChange={handleSelectChange} />)
					}
				</div>
			</div>
		</>
	)
}
export default InputWithSearch