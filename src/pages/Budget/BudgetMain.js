import React, { useState, useEffect, useRef } from 'react'
import { months } from '../../data/data'
import {
    useRouteMatch,
    useHistory,
    useLocation
} from 'react-router-dom'
import Pagination from '../../components/Pagination'
import {
    MdAdd
} from 'react-icons/md'
const Budget = (props) => {
    const token = props.token;
    const location = useLocation();
    const [budgets, setBudgets] = useState(location.state ? { count: location.state.count, budgets: location.state.budgets} : { count: 0, budgets: [] });
    const [budgetData, setBudgetData] = useState(() => {
        const date = new Date();
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const year = date.getFullYear().toString()
        return ({
            year: location.state ? location.state.searchState.year : year,
            month: location.state ? location.state.searchState.month : month,
            department: location.state ? location.state.searchState.department : 1,
            glCategoryId: location.state ? location.state.searchState.glCategoryId: 0
        })
    });
    const activePageRef = useRef(0);
    const [glCategories, setGlCategories] = useState([])
    const [departments, setDepartments] = useState([]);
    const { path } = useRouteMatch();
    const history = useHistory()
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
        fetch('http://172.16.3.101:54321/api/gl-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setGlCategories(respJ))
            .catch(ex => console.log(ex))
    }, [token]);
    // console.log(budgetData)
    const updateList = (page) => {
        const data = {
            period: budgetData.year + budgetData.month,
            structureid: budgetData.department,
            glCategoryId: budgetData.glCategoryId,
            from: page,
            next: 20
        };
        // console.log(data)
        fetch('http://172.16.3.101:54321/api/get-budgets', {
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
                setBudgets({ count: totalCount, budgets: respJ });
            })
    }
    const handleMonthSelect = (month) => {
        setBudgetData(prev => ({ ...prev, month: month }))
    }
    const handleSelectChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setBudgetData(prev => ({ ...prev, [name]: value }))
    }
    const showExtStructureInfo = (structureid) => {
        console.log(structureid)
        history.push(`${path}/${structureid}`, { searchState: budgetData, budgets: budgets.budgets, count: budgets.count })
    }
    return (
        <div className="budget">
            <div>
                <div className="budget-ribbon">
                    <div className="months">
                        {
                            months.map(month =>
                                <div key={month.name} style={{backgroundColor: budgetData.month === month.value? '#0495ce' : ''}} onClick={() => handleMonthSelect(month.value)}>
                                    {month.name}
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <select name="department" value={budgetData.department} onChange={handleSelectChange}>
                            {
                                departments.map(department =>
                                    <option key={department.id} value={department.id}>{department.name}</option>)
                            }
                        </select>
                        <select name="year" value={budgetData.year} onChange={handleSelectChange}>
                            <option>2020</option>
                            <option>2021</option>
                            <option>2022</option>
                        </select>
                        <select name="glCategoryId" value={budgetData.glCategoryId} onChange={handleSelectChange} style={{ margin: '20px 10px 0px 0px' }}>
                            <option value="0">Hamısını göstər</option>
                            {
                                glCategories.map(category =>
                                    <option key={category.code} value={category.id}>{`${category.code}-${category.name}`}</option>)
                            }
                        </select>
                        <div style={{
                            color: 'white',
                            padding: '8px 30px',
                            borderRadius: '3px',
                            backgroundColor: '#0495ce',
                            cursor: 'pointer',
                            float: 'right',
                            margin: '20px 10px 0px 20px'
                        }}
                            onClick={() => updateList(0)}
                        >Axtar</div>
                    </div>
                </div>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Struktur</th>
                            <th>Büccə</th>
                            <th>Period</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            budgets.budgets.map((budget, index) =>
                                <tr onClick={() => showExtStructureInfo(budget.structure_id)} key={budget.structure_id}>
                                    <td>{index + 1}</td>
                                    <td>{budget.name}</td>
                                    <td>{budget.budget}</td>
                                    <td>{budget.period}</td>
                                    <td></td>
                                </tr>
                            )
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <MdAdd title="Əlavə et" color="rgb(238, 163, 1)" size="25" />
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <Pagination
                    count={budgets.count}
                    activePageRef={activePageRef}
                    updateList={updateList}
                />
            </div>
        </div>
    )
}

export default Budget