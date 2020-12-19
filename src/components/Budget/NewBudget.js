import React, { useState, useRef } from 'react'
import { months } from '../../data/data'
const date = new Date();
const month = date.getMonth() + 1;

const NewBudget = (props) => {
    const { token, departments } = props;
    const categories = props.categories.current;
    const commentRef = useRef(null);
    const glCategories = useRef(categories.filter(category => category.dependent_id === null));
    const subGlCategoryidRef = useRef(null);
    const [newBudgetData, setNewBudgetData] = useState({
        year: date.getFullYear(),
        month: month < 10 ? `0${month}` : `${month}`,
        department: '',
        glCategoryid: '',
        budget: 0
    })
    const subGlCategories = categories.filter(category => category.dependent_id === newBudgetData.glCategoryid)
    const handleBudgetChange = (e) => {
        const value = e.target.value;
        setNewBudgetData(prev => ({ ...prev, budget: /^\d*(\.)?\d{0,2}$/.test(value) ? value : prev.budget }))
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = name !== 'month' ? Number(e.target.value) : e.target.value;
        setNewBudgetData(prev => ({ ...prev, [name]: value }))
    }
    const addNewBudget = () => {
        const data = {
            ...newBudgetData,
            period: `${newBudgetData.year}${newBudgetData.month}`,
            quarter: (newBudgetData.month - 1) / 3 + 1,
            comment: commentRef.current.value,
            subGlCategoryid: subGlCategoryidRef.current.value,
        }
        fetch('http://172.16.3.101:54321/api/insert-new-budget', {
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
                if (respJ[0].result === 'success')
                    props.closeModal()
            })
    }
    return (
        <div className="new-budget-modal">
            <div>
                <div>
                    <select value={newBudgetData.month} name="month" onChange={handleChange}>
                        {
                            months.map((month, index) =>
                                <option key={index} value={month.value}>{month.name}</option>
                            )
                        }
                    </select>
                    <select value={newBudgetData.year} name="year" onChange={handleChange}>
                        <option>2020</option>
                        <option>2021</option>
                        <option>2022</option>
                    </select>
                </div>
            </div>
            <div>
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
                                        glCategories.current.map(category =>
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="subGlCategoryid" ref={subGlCategoryidRef}>
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
                <textarea ref={commentRef} style={{ marginTop: '20px', width: '100%' }} />
            </div>
            <div onClick={addNewBudget}>Əlavə et</div>
        </div>
    )
}
export default NewBudget