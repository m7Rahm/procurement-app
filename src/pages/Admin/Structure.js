import React, { useState, useEffect, useRef } from 'react'
import { FaEdit, FaCheck } from 'react-icons/fa'
import { IoMdClose, IoMdDoneAll, IoMdAdd } from 'react-icons/io'
import Pagination from '../../components/Misc/Pagination'
import StatusButton from '../../components/Misc/StatusButton'
import useFetch from '../../hooks/useFetch'
import OperationResult from "../../components/Misc/OperationResult"
const Structure = () => {
    const [departments, setDepartments] = useState({ content: [], count: 0 });
    const activePageRef = useRef(0);
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const [activeDepartments, setActiveDepartments] = useState([]);
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/departments?active=0&from=0')
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setDepartments({ content: respJ, count: totalCount })
            })
            .catch(ex => console.log(ex))
    }, [fetchGet]);
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/departments')
            .then(respJ => setActiveDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [fetchGet])
    const updateList = (page) => {
        fetchGet('http://192.168.0.182:54321/api/departments?active=0&from=' + page)
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setDepartments({ content: respJ, count: totalCount })
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div className="users-page structure-page">
            <table className="users-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ad</th>
                        <th>Tabe olduğu struktur</th>
                        <th>Tip</th>
                        <th>Anbar</th>
                        <th>Büdcə</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <NewStructureRow
                        updateList={updateList}
                        activePageRef={activePageRef}
                        activeDepartments={activeDepartments}
                        setActiveDepartments={setActiveDepartments}
                        departments={departments.content}
                        fetchPost={fetchPost}
                    />
                    {
                        departments.content.map((department, index) =>
                            <TableRow
                                key={department.id}
                                setActiveDepartments={setActiveDepartments}
                                activeDepartments={activeDepartments}
                                structure={department}
                                departments={departments}
                                fetchPost={fetchPost}
                                index={activePageRef.current * 20 + (index + 1)}
                            />
                        )
                    }
                </tbody>
            </table>
            <Pagination
                count={departments.count}
                activePageRef={activePageRef}
                updateList={updateList}
            />
        </div>
    )
}
export default Structure

const NewStructureRow = (props) => {
    const { activeDepartments, setActiveDepartments, updateList, activePageRef, fetchPost } = props;
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
    const [newStructureData, setNewStructureData] = useState({ name: '', parent_id: -1, type: 0, f_warehouse_id: 0 });
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewStructureData(prev => ({ ...prev, [name]: value }))
    }
    const addStructure = () => {
        const data = newStructureData;
        fetchPost('http://192.168.0.182:54321/api/new-structure', data)
            .then(respJ => {
                const id = respJ[0].id;
                setNewStructureData({ name: '', parent_id: -1 });
                setOperationResult({ visible: true, desc: "Əməliyyat uğurla nəticələndi", icon: FaCheck, iconColor: "rgb(15, 157, 88)", backgroundColor: "white" })
                setActiveDepartments(prev => [...prev, { ...newStructureData, id }]);
                updateList(20 * activePageRef.current)
            })
            .catch(ex => console.log(ex))
    }
    return (
        <tr>
            <td>
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                        backgroundColor={operationResult.backgroundColor}
                        iconColor={operationResult.iconColor}
                        icon={operationResult.icon}
                    />
                }
            </td>
            <td><input value={newStructureData.name} name="name" onChange={handleChange} /></td>
            <td>
                <select style={{ minWidth: '130px' }} name="parent_id" value={newStructureData.parent_id} onChange={handleChange}>
                    <option value="-1">-</option>
                    {
                        activeDepartments.map(department =>
                            <option value={department.id} key={department.id}>
                                {department.name}
                            </option>
                        )
                    }
                </select>
            </td>
            <td>
                <select style={{ minWidth: '130px' }} name="type" value={newStructureData.type} onChange={handleChange}>
                    <option value="0">Filial</option>
                    <option value="1">Struktur Vahidi</option>
                    <option value="2">Anbar</option>
                    <option value="3">STTŞ</option>
                </select>
            </td>
            <td>
                <select style={{ minWidth: '130px' }} name="f_warehouse_id" value={newStructureData.f_warehouse_id} onChange={handleChange}>
                    <option value="0">-</option>
                    {
                        // eslint-disable-next-line
                        activeDepartments.filter(department => department.type == 2).map(department =>
                            <option value={department.id} key={department.id}>
                                {department.name}
                            </option>
                        )
                    }
                </select>
            </td>
            <td>
                <select style={{ minWidth: '130px' }} name="f_budget_id" value={newStructureData.f_budget_id} onChange={handleChange}>
                    <option value="0">-</option>
                    {
                        // eslint-disable-next-line
                        activeDepartments.filter(department => department.type == 0).map(department =>
                            <option value={department.id} key={department.id}>
                                {department.name}
                            </option>
                        )
                    }
                </select>
            </td>
            <td></td>
            <td><IoMdAdd title="yeni struktur əlavə et" onClick={addStructure} color="#f8942a" /></td>
        </tr>
    )
}
const TableRow = (props) => {
    const { activeDepartments, setActiveDepartments, structure, fetchPost } = props;
    const [disabled, setDisabled] = useState(true);
    const [structureData, setStructureData] = useState(structure);
    const id = structure.id;
    const handleClick = () => {
        setDisabled(prev => !prev)
    }
    const handleCancel = () => {
        setStructureData({ name: structure.name, dependent_id: structure.dependent_id })
        setDisabled(true);
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setStructureData(prev => ({ ...prev, [name]: value }))
    }
    const handleDone = () => {
        const data = { ...structureData, id: structure.id }
        fetchPost('http://192.168.0.182:54321/api/update-structure', data)
            .then(_ => {
                setActiveDepartments(prev => prev.map(dep => dep.id === id ? structureData : dep))
                setDisabled(true);
            })
            .catch(ex => console.log(ex));
    }
    const updateFunc = (id, stat) => {
        const data = { ...structureData, id, active_passive: stat === 1 };
        fetchPost('http://192.168.0.182:54321/api/update-structure', data)
            .then(_ => {
                setActiveDepartments(prev =>
                    stat === 0
                        ? prev.filter(department => department.id !== id)
                        : [...prev, data]
                )
            })
            .catch(ex => console.log(ex))
    }
    return (
        <tr className="structure-row" key={structure.id}>
            <td>{props.index}</td>
            <td>
                <input disabled={disabled} name="name" value={structureData.name} onChange={handleChange} />
            </td>
            <td>
                <select name="parent_id" onChange={handleChange} disabled={disabled} value={structureData.parent_id || '-1'}>
                    <option value="-1">-</option>
                    {
                        activeDepartments.map(department =>
                            <option value={department.id} key={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select style={{ minWidth: '130px' }} disabled={disabled} name="type" value={structureData.type} onChange={handleChange}>
                    <option value="0">Filial</option>
                    <option value="1">Struktur Vahidi</option>
                    <option value="2">Anbar</option>
                    <option value="3">STTŞ</option>
                </select>
            </td>
            <td>
                <select name="f_warehouse_id" onChange={handleChange} disabled={disabled} value={structureData.f_warehouse_id}>
                    <option value="0">-</option>
                    {
                        // eslint-disable-next-line
                        activeDepartments.filter(department => department.type == 2).map(department =>
                            <option value={department.id} key={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select style={{ minWidth: '130px' }} name="f_budget_id" disabled={disabled} value={structureData.f_budget_id || ""} onChange={handleChange}>
                    <option value="0">-</option>
                    {
                        // eslint-disable-next-line
                        activeDepartments.filter(department => department.type == 0).map(department =>
                            <option value={department.id} key={department.id}>
                                {department.name}
                            </option>
                        )
                    }
                </select>
            </td>
            <td>
                <StatusButton
                    id={structure.id}
                    status={structureData.active_passive}
                    updateFunc={updateFunc}
                />
            </td>
            <td>
                {
                    disabled
                        ? <FaEdit onClick={handleClick} />
                        : <>
                            <IoMdClose color="#ff4a4a" onClick={handleCancel} />
                            <IoMdDoneAll color="#0F9D58" onClick={handleDone} />
                        </>
                }

            </td>
        </tr>
    )
}