import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import useFetch from '../../hooks/useFetch';
import VisaForwardPerson from './VisaForwardPerson'
const ForwardDocAdvanced = (props) => {
    const { handleSendClick, textareaVisible = true } = props;
    const [empList, setEmpList] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const searchInputRef = useRef(null);
    const allGroupsRef = useRef([]);
    const [checked, setChecked] = useState(false);
    const selectRef = useRef(null);
    const empListRef = useRef(null);
    const textareaRef = useRef(null);
    const fetchGet = useFetch("GET");
    useLayoutEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (mounted)
            fetchGet('http://192.168.0.182:54321/api/emplist', abortController)
                .then(respJ => {
                    if (mounted) {
                        empListRef.current = respJ;
                        setEmpList(respJ);
                    }
                })
                .catch(err => console.log(err));
        return () => {
            mounted = false;
            abortController.abort();
        }
    }, [fetchGet]);
    useLayoutEffect(() => {
        let mounted = true;
        const abortController = new AbortController()
        if (mounted)
            fetchGet('http://192.168.0.182:54321/api/departments', abortController)
                .then(respJ => {
                    if (mounted) {
                        setDepartments(respJ)
                    }
                })
                .catch(err => console.log(err));
        return () => {
            mounted = false;
            abortController.abort();
        }
    }, [fetchGet]);
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (checked && allGroupsRef.current.length === 0 && mounted) {
            fetchGet("http://192.168.0.182:54321/api/roles", abortController)
                .then(respJ => {
                    const groups = respJ
                        .filter(group => group.active_passive === 1)
                        .map(group => ({ id: group.id, full_name: group.name }));
                    allGroupsRef.current = groups;
                    setEmpList(groups);
                })
                .catch(ex => console.log(ex))
        }
        return () => {
            mounted = false;
            abortController.abort();
        }
    }, [fetchGet, checked])
    const handleSearchChange = (e) => {
        const str = e.target.value.toLowerCase();
        let searchResult
        if (!checked) {
            searchResult = empListRef.current.filter(emp => {
                if (selectRef.current && selectRef.current.value !== "-1")
                    return emp.full_name.toLowerCase().includes(str) && emp.structure_dependency_id === Number(selectRef.current.value);
                else
                    return emp.full_name.toLowerCase().includes(str)
            });
        } else {
            searchResult = allGroupsRef.current.filter(group => group.full_name.toLowerCase().includes(str))
        }
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
        searchInputRef.current.value = ""
    }
    const handleCheckChange = () => {
        searchInputRef.current.value = "";
        setChecked(prev => {
            if (!prev) {
                setEmpList(allGroupsRef.current)
            } else {
                setEmpList(empListRef.current)
            }
            return !prev
        });
    }
    return (
        <div style={{ padding: '10px 20px' }}>
            <div style={{ marginTop: '20px' }} id="procurement-edit-section">
                {
                    textareaVisible &&
                    <textarea ref={textareaRef} />
                }
                <div style={{ minHeight: '231px', minWidth: "250px" }}>
                    {
                        !checked &&
                        <select ref={selectRef} style={{ height: '30px' }} onChange={handleStructureChange}>
                            <option value="-1">-</option>
                            {
                                departments.map(structure =>
                                    <option key={structure.id} value={structure.id}>{structure.name}</option>
                                )
                            }
                        </select>
                    }
                    <div>
                        <input
                            type="text"
                            className="search-with-query"
                            placeholder="İşçinin adını daxil edin.."
                            ref={searchInputRef}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <ul className="employees-list">
                        {
                            empList.map(employee =>
                                <li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee)}>
                                    {employee.full_name}
                                    <br />
                                    <span>{employee.vezife}</span>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <div>
                <div className="toggle-container">
                    <span style={{ fontWeight: !checked ? "600" : "" }}>Manual</span>
                    <span className={`toggle-container ${checked ? 'active' : ''}`} onClick={handleCheckChange}>
                        <span></span>
                    </span>
                    <span>Qrup</span>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="send-order" onClick={() => handleSendClick(receivers, textareaRef.current.value, checked)}>
                    Göndər
                </div>
            </div>
            <ForwardedPeople
                receivers={receivers}
                setReceivers={setReceivers}
                handleSelectChange={handleSelectChange}
            />
        </div>
    )
}
export default React.memo(ForwardDocAdvanced)

export const ForwardedPeople = (props) => {
    const draggedElement = useRef(null);
    return (
        <div style={{ padding: '0px 20px', borderRadius: '5px' }}>
            <div style={{ marginTop: '20px', overflow: 'hidden', padding: '15px', border: '1px solid gray', borderRadius: '3px' }}>
                {
                    props.receivers.map((emp, index) =>
                        <VisaForwardPerson
                            key={emp.id}
                            id={emp.id}
                            emp={emp}
                            index={index}
                            draggedElement={draggedElement}
                            setReceivers={props.setReceivers}
                            handleSelectChange={props.handleSelectChange}
                        />
                    )
                }
            </div>
        </div>
    )
}