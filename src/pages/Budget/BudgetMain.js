import React, { useState, useEffect, useRef } from 'react'
import { months } from '../../data/data'
import Modal from '../../components/Misc/Modal'
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom'
import Pagination from '../../components/Misc/Pagination'
import { MdAdd } from 'react-icons/md'
import NewBudget from '../../components/Budget/NewBudget'
import useFetch from '../../hooks/useFetch'
const Budget = () => {
    const location = useLocation();
    const categories = useRef([]);
    const [modalState, setModalState] = useState({ visibility: false, content: null });
    const [budgets, setBudgets] = useState(location.state ? { count: location.state.count, budgets: location.state.budgets } : { count: 0, budgets: [] });
    const [budgetData, setBudgetData] = useState(() => {
        const date = new Date();
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const year = date.getFullYear().toString()
        return ({
            year: location.state ? location.state.searchState.year : year,
            month: location.state ? location.state.searchState.month : month,
            department: location.state ? location.state.searchState.department : 0,
            glCategoryId: location.state ? location.state.searchState.glCategoryId : 0
        })
    });
    const activePageRef = useRef(0);
    const [glCategories, setGlCategories] = useState([])
    const [departments, setDepartments] = useState([]);
    const { path } = useRouteMatch();
    const history = useHistory();
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/departments')
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [fetchGet]);
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/gl-categories')
            .then(respJ => {
                categories.current = respJ;
                const glCategories = respJ.filter(category => category.dependent_id === 0);
                setGlCategories(glCategories);
            })
            .catch(ex => console.log(ex))
    }, [fetchGet])
    const updateList = (page) => {
        const data = {
            period: budgetData.year + budgetData.month,
            structureid: budgetData.department,
            glCategoryId: budgetData.glCategoryId,
            from: page,
            next: 20
        };
        fetchPost('http://192.168.0.182:54321/api/get-budgets', data)
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
        const structure = departments.find(department => department.id === structureid)
        history.push(`${path}/${structureid}`, {
            searchState: budgetData,
            budgets: budgets.budgets,
            count: budgets.count,
            structure
        })
    }
    const addNewBudget = () => {
        const newBudget = (props) => <NewBudget categories={categories} departments={departments} {...props} />
        setModalState({ visibility: true, content: newBudget })
    }
    const closeModal = () => {
        setModalState({ visibility: false, content: null })
    }
    return (
        <div className="budget">
            <div>
                <div className="budget-ribbon">
                    <div className="months">
                        {
                            months.map(month =>
                                <div key={month.name} style={{ backgroundColor: budgetData.month === month.value ? '#0495ce' : '' }} onClick={() => handleMonthSelect(month.value)}>
                                    {month.name}
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <select name="department" value={budgetData.department} onChange={handleSelectChange}>
                            <option value="0">Hamısını göstər</option>
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
                            <th>Period</th>
                            <th>Büdcə</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            budgets.budgets.map((budget, index) =>
                                <tr onClick={() => showExtStructureInfo(budget.structure_id)} key={index}>
                                    <td style={{ width: '80px' }}>{index + 1}</td>
                                    <td>{budget.structure_name}</td>
                                    <td>{budget.period}</td>
                                    <td>{budget.budget}</td>
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
                                <MdAdd title="Əlavə et" onClick={addNewBudget} color="rgb(238, 163, 1)" size="25" />
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <Pagination
                    count={budgets.count}
                    activePageRef={activePageRef}
                    updateList={updateList}
                />
                {
                    modalState.visibility &&
                    <Modal title="Büdcə artımı" changeModalState={closeModal}>
                        {modalState.content}
                    </Modal>
                }
            </div>
        </div>
    )
}

export default Budget