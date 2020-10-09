import React, { useState, useRef } from 'react'
import { months } from '../../data/data'
const NewBudget = (props) => {
    const departments = props.departments;
    const categories = props.categories.current;
    const date = new Date();
    const month = date.getMonth() + 1;
    console.log(categories)
    const glCategories = useRef(categories.filter(category => category.dependent_id === null));
    const matCategories = [];
    const matSubCategories = [];
    const [newBudgetData, setNewBudgetData] = useState({
        year: date.getFullYear(),
        month: month < 10 ? `0${month}` : `${month}`,
        department: 1,
        glCategoryid: '',
        subGlCategoryid: '',
        categoryid: '',
        subCategoryid: ''
    })
    const subGlCategories = categories.filter(category => category.dependent_id === newBudgetData.glCategoryid)
    
    const token = props.token;
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewBudgetData(prev => ({...prev, [name]: value}))
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
                <select value={newBudgetData.department} name="department" onChange={handleChange}>
                    {
                        departments.map((department) =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </div>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Gl Category</th>
                        <th>Sub-Gl Category</th>
                        <th>Category</th>
                        <th>Sub-Category</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select value={newBudgetData.glCategoryid} name="glCategoryid" onChange={handleChange}>
                                {
                                    glCategories.current.map(category =>
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <select value={newBudgetData.subGlCategoryid} name="subGlCategoryid" onChange={handleChange}>
                                {
                                    subGlCategories.map(category =>
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <select value={newBudgetData.categoryid} name="categoryid" onChange={handleChange}>
                                {
                                    matCategories.map(category =>
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <select value={newBudgetData.subCategoryid} name="subCategoryid" onChange={handleChange}>
                                {
                                    matSubCategories.map(category =>
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                }
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default NewBudget