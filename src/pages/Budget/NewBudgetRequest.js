import React, { useRef, useState, useEffect, useContext } from 'react'
import { months } from '../../data/data'
import ForwardDocAdvanced from '../../components/Misc/ForwardDocAdvanced'
import OperationResult from "../../components/Misc/OperationResult"
import useFetch from '../../hooks/useFetch';
import { WebSocketContext } from '../SelectModule';
const date = new Date();
const month = date.getMonth() + 1;
const year = date.getFullYear();

const NewBudgetRequest = (props) => {
    const [glCategories, setGlCategories] = useState({ parent: [], sub: [], all: [] });
    const glCategoryRef = useRef(null);
    const subGlCategoryidRef = useRef(null);
    const [departments, setDepartments] = useState([]);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const webSocket = useContext(WebSocketContext);
    const [newBudgetData, setNewBudgetData] = useState({
        year: date.getFullYear(),
        month: month < 10 ? `0${month}` : `${month}`,
        department: '',
        glCategoryid: '',
        budget: 0
    })
    const subGlCategories = glCategories.all.filter(category => category.dependent_id === newBudgetData.glCategoryid);
    useEffect(() => {
        props.modalWrapperRef.current.style.width = "70rem";
        fetchGet('http://192.168.0.182:54321/api/departments')
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [fetchGet, props.modalWrapperRef]);
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/gl-categories')
            .then(respJ => {
                const glCategories = respJ.filter(category => category.dependent_id === 0);
                setGlCategories({ parent: glCategories, all: respJ, sub: [] });
            })
            .catch(ex => console.log(ex))
    }, [fetchGet]);
    const handleSendClick = (receivers, comment, isGroup) => {
        if (receivers.length !== 0) {
            const recs = receivers.map((receiver, index) => [receiver.id, isGroup ? 1 : (index === 0) ? 1 : 0])
            const data = {
                sendType: !isGroup ? 0 : 1,
                comment: comment,
                year: newBudgetData.year,
                month: newBudgetData.month,
                glCategory: subGlCategoryidRef.current.value,
                structure: newBudgetData.department,
                amount: newBudgetData.budget,
                recs
            }
            fetchPost("http://192.168.0.182:54321/api/new-budget-inc-req", data)
                .then(respJ => {
                    if (!respJ[0].error) {
                        props.closeModal();
                        props.setInitData(prev => ({
                            ...prev,
                            result: 0,
                            from: 0
                        }))
                        const message = {
                            message: "notification",
                            receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: "nO" })),
                            data: undefined
                        }
                        webSocket.send(JSON.stringify(message))
                    } else {
                        setOperationResult({ visible: true, desc: respJ[0].error })
                    }
                })
                .catch(ex => console.log(ex))
        }
    }
    const handleBudgetChange = (e) => {
        const value = e.target.value;
        setNewBudgetData(prev => ({ ...prev, budget: /^\d*(\.)?\d{0,2}$/.test(value) ? value : prev.budget }))
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = name !== 'month' ? Number(e.target.value) : e.target.value;
        setNewBudgetData(prev => ({ ...prev, [name]: value }))
    }
    const handleGlCategoryChange = (e) => {
        const value = e.target.value;
        const charArray = value.split("")
        const reg = charArray.reduce((conc, curr) => conc += curr !== "\\" ? curr + "+" : curr + "\\+", "")
        const regExp = new RegExp(reg, "gi")
        setGlCategories(prev => ({ ...prev, parent: prev.all.filter(category => regExp.test(category.name) || regExp.test(category.code)) }))
    }
    const handleGlCategoryBlur = (e) => {
        const relatedTarget = e.relatedTarget
        if (relatedTarget && relatedTarget.classList.contains("category-dep")) {
            relatedTarget.click()
        }
    }
    const handleGlCategorySelect = (category) => {
        glCategoryRef.current.value = category.name
        setNewBudgetData(prev => ({ ...prev, glCategoryid: category.id }))
    }
    return (
        <div>
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                />
            }
            <div style={{ padding: "20px" }}>
                <div className="date-ribbon" style={{ margin: "10px 0px" }}>
                    <select value={newBudgetData.month} name="month" onChange={handleChange}>
                        {
                            months.map((month, index) =>
                                <option key={index} value={month.value}>{month.name}</option>
                            )
                        }
                    </select>
                    <select value={newBudgetData.year} name="year" onChange={handleChange}>
                        <option value={year}>{year}</option>
                        <option value={year + 1}>{year + 1}</option>
                    </select>
                </div>
                <table className="new-budget users-table">
                    <thead>
                        <tr>
                            <th>Gl Kateqoriya</th>
                            <th>Sub-Gl Kateqoriya</th>
                            <th>Departament</th>
                            <th>Büdcə</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                            <div className="gl-category-code" style={{ position: "relative" }} >
                                    <input
                                        onChange={handleGlCategoryChange}
                                        placeholder="Kod və ya ad"
                                        name="glCategoryid"
                                        autoComplete="off"
                                        onBlur={handleGlCategoryBlur}
                                        type="text"
                                        className="structures-list"
                                        ref={glCategoryRef}
                                    />
                                    <ul className="structures-list" style={{ top: "2rem" }}>
                                        {
                                            glCategories.parent.map(category => {
                                                const inputVal = glCategoryRef.current ? glCategoryRef.current.value : "";
                                                const strRegExp = new RegExp(`[${inputVal}]`, 'gi');
                                                const title = `${category.code} ${category.name}`.replace(strRegExp, (text) => `<i>${text}</i>`)
                                                return <li tabIndex="1" dangerouslySetInnerHTML={{ __html: title }} className="category-dep" key={category.id} onClick={() => handleGlCategorySelect(category)} ></li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </td>
                            <td>
                                <select name="subGlCategoryid" style={{ width: "90%" }} ref={subGlCategoryidRef}>
                                    <option>-</option>
                                    {
                                        subGlCategories.map(category =>
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select value={newBudgetData.department} name="department" onChange={handleChange}>
                                    <option value="-1">-</option>
                                    {
                                        departments.map((department) =>
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <input value={newBudgetData.budget} name="budget" onChange={handleBudgetChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ForwardDocAdvanced
                    handleSendClick={handleSendClick}
                />
            </div>
        </div>
    )
}
export default NewBudgetRequest