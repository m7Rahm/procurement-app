import React, { useRef, useState, useEffect } from 'react'
import ForwardDocAdvanced from '../../components/Misc/ForwardDocAdvanced'
const date = new Date();
const month = date.getMonth() + 1;

const NewBudgetRequest = (props) => {
    const [glCategories, setGlCategories] = useState({ parent: [], sub: [], all: [] });
    const subGlCategoryidRef = useRef(null);
    const [departments, setDepartments] = useState([]);
    const [newBudgetData, setNewBudgetData] = useState({
        year: date.getFullYear(),
        month: month < 10 ? `0${month}` : `${month}`,
        department: '',
        glCategoryid: '',
        budget: 0
    })
    const subGlCategories = glCategories.all.filter(category => category.dependent_id === newBudgetData.glCategoryid);
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [props.token]);
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/gl-categories', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const glCategories = respJ.filter(category => category.dependent_id === 0);
                setGlCategories({ parent: glCategories, all: respJ, sub: [] });
            })
            .catch(ex => console.log(ex))
    }, [props.token]);
    const handleSendClick = (receivers, comment, isGroup) => {
        if (receivers.length !== 0) {
            const recs = receivers.map((receiver, index) => [receiver.id, isGroup ? 1 : (index === 0) ? 1 : 0])
            const data = JSON.stringify({
                sendType: !isGroup ? 0 : 1,
                comment: comment,
                year: newBudgetData.year,
                month: newBudgetData.month,
                glCategory: subGlCategoryidRef.current.value,
                structure: newBudgetData.department,
                amount: newBudgetData.budget,
                recs
            })
            fetch("http://192.168.0.182:54321/api/new-budget-inc-req", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + props.token,
                    "Content-Type": "application/json",
                    "Content-Length": data.length
                },
                body: data
            })
                .then(resp => resp.ok ? resp.json() : new Error('Internal Server Error'))
                .then(respJ => {
                    if (!respJ[0].error) {
                        props.closeModal();
                        props.setInitData(prev => ({
                            ...prev,
                            result: 0,
                            from: 0
                        }))
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
    return (
        <div>
            <div style={{ padding: "20px" }}>
                <table className="new-budget users-table">
                    <thead>
                        <tr>
                            <th>Gl Category</th>
                            <th>Sub-Gl Category</th>
                            <th>Department</th>
                            <th>Budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select value={newBudgetData.glCategoryid} name="glCategoryid" onChange={handleChange}>
                                    <option>-</option>
                                    {
                                        glCategories.parent.map(category =>
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="subGlCategoryid" ref={subGlCategoryidRef} style={{ width: "100%" }}>
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
                    token={props.token}
                    handleSendClick={handleSendClick}
                />
            </div>
        </div>
    )
}
export default NewBudgetRequest