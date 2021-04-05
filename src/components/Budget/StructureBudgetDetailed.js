import React, { useEffect, useState, useRef } from 'react'
import Pagination from '../Misc/Pagination'
import { useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdDone, MdClose } from 'react-icons/md'
import useFetch from '../../hooks/useFetch';
const StructureBudgetDetailed = () => {
    const location = useLocation();
    const state = location.state;
    const activePageRef = useRef(0);
    const fetchPost = useFetch("POST");
    const searchStateRef = useRef((() => {
        if (state) {
            const structureid = state.structure.id;
            const glCategoryId = state.glCategoryid;
            const period = state.searchState.year + state.searchState.month
            return ({ period, glCategoryId, from: 0, next: 20, structureid })
        }
        else
            return undefined
    })()
    )
    const [budgets, setBudgets] = useState({ count: 0, content: [] })
    useEffect(() => {
        if (searchStateRef.current) {
            const structureid = searchStateRef.current.structureid;
            const data = searchStateRef.current
            fetchPost(`http://192.168.0.182:54321/api/structure-budget/${structureid}`, data)
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    setBudgets({ count: totalCount, content: respJ });
                })
        }
    }, [state, fetchPost])

    const updateList = (from) => {
        const structureid = searchStateRef.current.structureid;
        const data = { ...searchStateRef.current, from };
        fetchPost(`http://192.168.0.182:54321/api/structure-budget/${structureid}`, data)
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setBudgets({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div className="structure-budget-detailed">
            <table style={{ margin: 'auto', width: '100%' }} className="users-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Gl category</th>
                        <th>Sub-Gl category</th>
                        <th></th>
                        <th></th>
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
                                fetchPost={fetchPost}
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

const TableRow = ({ budget, index, fetchPost }) => {
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
        const data = {
            budget: budgetData.budget,
            active: 1
        }
        fetchPost(`http://192.168.0.182:54321/api/update-budget/${id}`, data)
            .then(respJ => {
                if (respJ[0].operation_result === 'success')
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
            <td></td>
            <td></td>
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