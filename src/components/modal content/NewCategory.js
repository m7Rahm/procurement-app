import React, { useState, useEffect, useContext, useRef } from 'react'
import {
    MdModeEdit
} from 'react-icons/md'
import {
    FaPlus
} from 'react-icons/fa'
import { TokenContext } from '../../App'
const NewCategory = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const [categories, setCategories] = useState({ parent: [], sub: [] });
    const [departments, setDepartments] = useState([]);
    const [newCatState, setNewCatState] = useState({ catName: '', department: 1 })
    const [tableData, setTableData] = useState([]);
    const subCategoriesRef = useRef([]);
    const handleAddNewCategory = () => {
    }
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
        fetch('http://172.16.3.101:54321/api/material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const sub = [];
                const parent = [];
                respJ.forEach(category => {
                    category.parent_id === 34
                        ? parent.push(category)
                        : sub.push(category)
                });
                subCategoriesRef.current = sub;
                setCategories({ sub, parent })
            })
            .catch(ex => console.log(ex))
    }, [token]);
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setNewCatState(prev => ({ ...prev, [name]: value }))
    }
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategories(prev => {
            const sub = subCategoriesRef.current.filter(cat => cat.parent_id.toString() === value);
            return { ...prev, sub }
        })
    }
    return (
        <div className="sys-param-modal">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ad</th>
                            <th>Kateqoriya</th>
                            <th>Alt Kateqoriya</th>
                            <th>Yöndərilən struktur</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td><input type="text" name="catName" value={newCatState.catName} onChange={handleChange} /></td>
                            <td>
                                <select onChange={handleCategoryChange} name="department" value={newCatState.category}>
                                    {
                                        categories.parent.map(category =>
                                            <option key={category.id} value={category.id}>{category.product_title}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select onChange={handleChange} name="department" value={newCatState.category}>
                                    {
                                        categories.sub.map(subCat =>
                                            <option key={subCat.id} value={subCat.id}>{subCat.product_title}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select onChange={handleChange} name="department" value={newCatState.department}>
                                    {
                                        departments.map(department =>
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td><FaPlus onClick={handleAddNewCategory} cursor="pointer" /></td>
                        </tr>
                        {
                            tableData.map((material, index) =>
                                <tr key={material.id}>
                                    <th>{index + 1}</th>
                                    <td>{material.product_title}</td>
                                    <td style={{ width: '250px' }}>
                                        <select disabled={true} value={material.department_id || 3}>
                                            {
                                                departments.map(department =>
                                                    <option key={department.id} value={department.id}>{department.name}</option>
                                                )
                                            }
                                        </select>
                                    </td>
                                    <td>{material.user}</td>
                                    <td><MdModeEdit color="gray" cursor="not-allowed" /></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default NewCategory