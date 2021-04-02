import React, { useState, useRef, useLayoutEffect } from 'react'
import VisaForwardPerson from './VisaForwardPerson'
const ForwardDocLayout = (props) => {
    const { handleSendClick, token, textareaVisible = true } = props;
    const [empList, setEmpList] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const selectRef = useRef(null);
    const empListRef = useRef(null);
    const textareaRef = useRef(null);
    useLayoutEffect(() => {
        let mounted = true;
        if (mounted)
            fetch('http://192.168.0.182:54321/api/emplist', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.status === 200 ? resp.json() : new Error('Internal Server Error'))
                .then(respJ => {
                    if (mounted) {
                        empListRef.current = respJ;
                        setEmpList(respJ);
                    }
                })
                .catch(err => console.log(err));
        return () => mounted = false
    }, [token]);
    useLayoutEffect(() => {
        let mounted = true;
        if(mounted)
            fetch('http://192.168.0.182:54321/api/departments', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.status === 200 ? resp.json() : new Error('Internal Server Error'))
                .then(respJ => {
                    if(mounted){
                        setDepartments(respJ)
                    }
                })
                .catch(err => console.log(err));
        return () => mounted = false
    }, [token]);
    const handleSearchChange = (e) => {
        const str = e.target.value.toLowerCase();
        const searchResult = empListRef.current.filter(emp => {
            if (selectRef.current.value !== "-1")
                return emp.full_name.toLowerCase().includes(str) && emp.structure_dependency_id === Number(selectRef.current.value);
            else
                return emp.full_name.toLowerCase().includes(str)
        });
        setSearchQuery(str);
        setEmpList(searchResult);
    }
    const handleStructureChange = (e) => {
        const value = Number(e.target.value);
        setEmpList(value !== -1 ? empListRef.current.filter(employee => employee.structure_dependency_id === value) : empListRef.current);
    }
    const handleSelectChange = (employee) => {
        const res = receivers.find(emp => emp.id === employee.id);
        const newReceivers = !res ? [...receivers, employee] : receivers.filter(emp => emp.id !== employee.id);
        setReceivers(newReceivers);
        setSearchQuery('');
    }
    return (
        <div style={{ padding: '10px 20px' }}>
            <div style={{ marginTop: '20px' }} id="procurement-edit-section">
                {
                    textareaVisible &&
                    <textarea ref={textareaRef} />
                }
                <div style={{ minHeight: '231px' }}>
                    <select ref={selectRef} style={{ height: '30px' }} onChange={handleStructureChange}>
                        <option value="-1">-</option>
                        {
                            departments.map(structure =>
                                <option key={structure.id} value={structure.id}>{structure.name}</option>
                            )
                        }
                    </select>
                    <div>
                        <input type="text" className="search-with-query" placeholder="İşçinin adını daxil edin.." value={searchQuery} onChange={handleSearchChange}></input>
                    </div>
                    <ul className="employees-list">
                        {
                            empList.map(employee =>
                                <li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee)}>
                                    {employee.full_name}
                                    <br/>
                                    <span>{employee.vezife}</span>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="send-order" onClick={() => handleSendClick(receivers, textareaRef.current.value)}>
                    Göndər
                </div>
            </div>
            <div style={{ padding: '0px 20px', borderRadius: '5px' }}>
                <div style={{ marginTop: '20px', overflow: 'hidden', padding: '15px', border: '1px solid gray', borderRadius: '3px' }}>
                    {
                        receivers.map(emp => <VisaForwardPerson key={Math.random()} emp={emp} handleSelectChange={handleSelectChange} />)
                    }
                </div>
            </div>
        </div>
    )
}
export default React.memo(ForwardDocLayout)