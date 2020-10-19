import React, { useState, useRef, useEffect } from 'react'
import { months } from '../../data/data'
const NewBudget = (props) => {
    const departments = props.departments;
    const categories = props.categories.current;
    const date = new Date();
    const month = date.getMonth() + 1;
    const glCategories = useRef(categories.filter(category => category.dependent_id === null));
    const matCategoriesRef = useRef([])
    const [matCategories, setMatCategories] = useState([]);
    const subGlCategoryidRef = useRef(null);
    const subCategoryidRef = useRef(null);
    const [newBudgetData, setNewBudgetData] = useState({
        year: date.getFullYear(),
        month: month < 10 ? `0${month}` : `${month}`,
        department: 1,
        glCategoryid: 1,
        categoryid: '',
        budget: 0
    })
    const subGlCategories = categories.filter(category => category.dependent_id === newBudgetData.glCategoryid)
    const matSubCategories = matCategoriesRef.current.filter(category => category.parent_id === newBudgetData.categoryid);

    const token = props.token;

    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                matCategoriesRef.current = respJ;
                const matCategories = respJ.filter(category => category.parent_id === 34);
                // console.log(matCategories)
                setMatCategories(matCategories)
            })
    }, [token])
    const handleChange = (e) => {
        const name = e.target.name;
        const value = name !== 'month' ? Number(e.target.value) : e.target.value;
        setNewBudgetData(prev => ({ ...prev, [name]: value }))
    }
    console.log(newBudgetData)
    const addNewBudget = () => {
        const data = {
            ...newBudgetData,
            period: `${newBudgetData.year}${newBudgetData.month}`,
            quarter: (newBudgetData.month - 1) / 3 + 1,
            subGlCategoryid: subGlCategoryidRef.current.value,
            subCategoryid: subCategoryidRef.current.value
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
                <select value={newBudgetData.department} name="department" onChange={handleChange}>
                    {
                        departments.map((department) =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </div>
            <div>
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
                                <select name="subGlCategoryid" ref={subGlCategoryidRef}>
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
                                            <option key={category.id} value={category.id}>{category.product_title}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="subCategoryid" ref={subCategoryidRef}>
                                    {
                                        matSubCategories.map(category =>
                                            <option key={category.id} value={category.id}>{category.product_title}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <input value={newBudgetData.budget} name="budget" onChange={handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div onClick={addNewBudget}>Əlavə et</div>
        </div>
    )
}
export default NewBudget