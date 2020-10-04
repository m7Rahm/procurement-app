import React, { useState, useEffect } from 'react'
import {
    useParams, useHistory
} from 'react-router-dom'
import {
    MdEdit
} from 'react-icons/md'
import {
    IoIosArrowBack
} from 'react-icons/io'

const BudgetRow = ({ budget, glCategories, subGlCategories, index, materialCategories, materialSubCategories }) => {
    const [disabled, setDisabled] = useState(true);
    const [budgetRow, setBudgetRow] = useState(budget);
    const toggleEdit = () => {
        setDisabled(prev => !prev)
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setBudgetRow(prev => ({...prev, [name]: value}))
    }
    return (
        <tr>
            <td>{index}</td>
            <td>
                <select disabled={disabled} name="gl_category_id" value={budgetRow.gl_category_id} onChange={handleChange}>
                    {
                        glCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
            <select disabled={disabled} name="sub_gl_category_id" value={budgetRow.sub_gl_category_id || ''} onChange={handleChange}>
                    {
                        subGlCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select disabled={disabled} name="category_id" value={budgetRow.category_id} onChange={handleChange}>
                    {
                        materialCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select disabled={disabled} name="sub_category_id" value={budgetRow.sub_category_id || ''} onChange={handleChange}>
                    {
                        materialSubCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </td>
            <td><input disabled={disabled} value="90923" name="blanco" onChange={handleChange}/></td>
            <td><input disabled={disabled} name="budget" value={budgetRow.budget} onChange={handleChange}/></td>
            <td><MdEdit onClick={toggleEdit} /></td>
        </tr>
    )
}

const StructureBudget = (props) => {
    const params = useParams();
    const history = useHistory();
    const [structureBudget, setStructureBudget] = useState({ budgets: [], count: 0 });
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState({ gl: [], subGl: [] });
    const [materialCats, setMaterialCats] = useState({ cat: [], subCat: [] });
    const state = props.location.state;
    const searchState = state.searchState;
    const structureid = params.structureid;
    const token = props.token;
    const department = departments.find(department => department.id.toString() === structureid);

    const handleBackNavigation = () => {
        history.replace('/budget', state)
    }
    useEffect(() => {
        if (searchState) {
            const data = { from: 0, next: 20, period: searchState.year + searchState.month, glCategoryId: 0 };
            fetch(`http://172.16.3.101:54321/api/structure-budget/${structureid}`, {
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
                    const totalCount = respJ[0] ? respJ[0].total_count : 0;
                    setStructureBudget({ count: totalCount, budgets: respJ });
                })
                .catch(ex => console.log(ex))
        }
        fetch('http://172.16.3.101:54321/api/get-material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {

            })
            .catch(ex => console.log(ex))
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex))
        fetch('http://172.16.3.101:54321/api/gl-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(resp => resp.json())
        .then(respJ => {
            const glCategories = [];
            const subGlCategories = [];
            respJ.forEach(category => {
                if(category.dependent_id === null) 
                    glCategories.push(category)
                else
                    subGlCategories.push(category)
            })
            setCategories({gl: glCategories, subGl: subGlCategories})
        })
    }, [structureid, searchState, token])
    return (
        <div className="budget strucutre-budget">
            <div>
                <div className="budget-navigation-ribbon">
                    <IoIosArrowBack title="Geriyə" onClick={handleBackNavigation} size="30" />
                    <h1>{department ? department.name : null}</h1>
                </div>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>GL kateqoriya</th>
                            <th>Sub-GL kateqoriya</th>
                            <th>Kateqoriya</th>
                            <th>Sub-Kateqoriya</th>
                            <th>Balans</th>
                            <th>Büccə</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            structureBudget.budgets.map((budget, index) =>
                                <BudgetRow
                                    key={budget.id}
                                    index={index + 1}
                                    glCategories={categories.gl}
                                    budget={budget}
                                    subGlCategories={categories.subGl}
                                    materialCategories={materialCats.cat}
                                    materialSubCategories={materialCats.subCat}
                                />
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default StructureBudget