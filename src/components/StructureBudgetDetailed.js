import React, { useEffect, useContext, useState, useRef } from 'react'
import Pagination from './Pagination'
import { TokenContext } from '../App'
import { useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import {
    MdDone,
    MdClose
} from 'react-icons/md'
const TableRow = ({ budget, index }) => {
    const [budgetData, setBudgetData] = useState(budget);
    const [disabled, setDisabled] = useState(true);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setBudgetData(prev => ({ ...prev, [name]: value }))
    }
    const handleEdit = () => {
        setDisabled(false)
    }
    const handleUpdate = () => {
        console.log(budgetData)
    }
    const handleCancel = () => {
        setBudgetData(budget);
        setDisabled(true);
    }
    return (
        <tr>
            <td>{index}</td>
            <td>{budget.gl_category_name}</td>
            <td>{budget.gl_sub_category_name}</td>
            <td>{budget.category_name}</td>
            <td>{budget.sub_category_name}</td>
            <td>
                <input disabled={disabled} onChange={handleChange} name="budget" value={budget.budget} />
            </td>
            <td>
                {
                    disabled
                        ? <FaEdit onClick={handleEdit} />
                        : <>
                            <MdDone color="green" onClick={handleUpdate} />
                            <MdClose color="red" onClick={handleCancel} />
                        </>
                }
            </td>
        </tr>
    )
}
const StructureBudgetDetailed = (props) => {
    const tokenConext = useContext(TokenContext);
    const token = tokenConext[0];
    const location = useLocation();
    const state = location.state;
    const activePageRef = useRef(0);
    const [budgets, setBudgets] = useState({ count: 0, content: [] })
    useEffect(() => {
        if (state) {
            const structureid = state.structure.id;
            const glCategoryId = state.glCategoryId;
            const period = state.searchState.year + state.searchState.month
            const data = { period, glCategoryId, from: 0, next: 20 }
            fetch(`http://172.16.3.101:54321/api/structure-budget/${structureid}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Length': JSON.stringify(data).length,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    setBudgets({ count: totalCount, content: respJ });
                })
        }
    }, [state, token])
    const updateList = () => {

    }
    return (
        <div className="structure-budget-detailed">
            <table style={{ margin: 'auto', width: '100%' }} className="users-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Gl category</th>
                        <th>Sub-Gl category</th>
                        <th>Category</th>
                        <th>Sub-Category</th>
                        <th>Budget</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        budgets.content.map((budget, index) =>
                            <TableRow index={index + 1} key={budget.id} budget={budget} />
                        )
                    }
                </tbody>
            </table>
            <Pagination
                count={budgets.count}
                activePageRef={activePageRef}
                updateList={updateList}
            />
        </div>
    )
}

export default StructureBudgetDetailed