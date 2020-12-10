import React, { useEffect, useContext, useState, useRef } from 'react'
import Pagination from '../Misc/Pagination'
import { TokenContext } from '../../App'
import { useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import {
    MdDone,
    MdClose
} from 'react-icons/md'
const StructureBudgetDetailed = (props) => {
    const tokenConext = useContext(TokenContext);
    const token = tokenConext[0];
    const location = useLocation();
    const state = location.state;
    const activePageRef = useRef(0);
    const searchStateRef = useRef(
        (() => {
            if (state) {
                const structureid = state.structure.id;
                const glCategoryId = state.glCategoryId;
                const filialid = state.filialid;
                const period = state.searchState.year + state.searchState.month
                return ({ period, glCategoryId, from: 0, next: 20, filialid, structureid })
            }
            else
                return undefined
        })()
    )
    const [budgets, setBudgets] = useState({ count: 0, content: [] })
    useEffect(() => {
        if (searchStateRef.current) {
            const structureid = searchStateRef.current.structureid;
            const data = JSON.stringify(searchStateRef.current)
            fetch(`http://172.16.3.101:54321/api/structure-budget/${structureid}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Length': data.length,
                    'Content-Type': 'application/json'
                },
                body: data
            })
                .then(resp => resp.json())
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    setBudgets({ count: totalCount, content: respJ });
                })
        }
    }, [state, token])

    const updateList = (from) => {
        const structureid = searchStateRef.current.structureid;
        const data = JSON.stringify({ ...searchStateRef.current, from })
        fetch(`http://172.16.3.101:54321/api/structure-budget/${structureid}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Length': data.length,
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setBudgets({ count: totalCount, content: respJ });
            })
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
                            <TableRow
                                index={index + 1}
                                key={budget.id}
                                budget={budget}
                                token={token}
                            />
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

const TableRow = ({ budget, index, token }) => {
    const [budgetData, setBudgetData] = useState(budget);
    const [disabled, setDisabled] = useState(true);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setBudgetData(prev => ({ ...prev, [name]: value }));
    }
    const handleEdit = () => {
        setDisabled(false)
    }
    const handleUpdate = (id) => {
        const data = JSON.stringify({
            budget: budgetData.budget,
            filialid: budgetData.filial_id,
            active: 1,
            structureid: budgetData.structure_id,
            categoryid: budgetData.category_id,
            quarter: budgetData.quarter
        })
        fetch(`http://172.16.3.101:54321/api/update-budget/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
        .then(resp => resp.json())
        .then(respJ => {
            if(respJ[0].operation_result === 'success')
                setDisabled(true)
        })
    }
    const handleCancel = () => {
        setBudgetData(budget);
        setDisabled(true);
    }
    return (
        <tr>
            <td>{index}</td>
            <td>{budget.gl_category_name}</td>
            <td>{budget.sub_gl_category_name}</td>
            <td>{budget.category_name}</td>
            <td>{budget.sub_category_name}</td>
            <td>
                <input disabled={disabled} onChange={handleChange} name="budget" value={budgetData.budget} />
            </td>
            <td>
                {
                    disabled
                        ? <FaEdit onClick={handleEdit} />
                        : <>
                            <MdDone color="green" onClick={() => handleUpdate(budget.id)} />
                            <MdClose color="red" onClick={handleCancel} />
                        </>
                }
            </td>
        </tr>
    )
}