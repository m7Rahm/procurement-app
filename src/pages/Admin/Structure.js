import React, { useContext, useState, useEffect, useRef } from 'react'
import { TokenContext } from '../../App'
import {
    FaEdit
} from 'react-icons/fa'
import {
    IoMdClose,
    IoMdDoneAll,
    IoMdAdd,
} from 'react-icons/io'
import Pagination from '../../components/Misc/Pagination'
import StatusButton from '../../components/Misc/StatusButton'

const Structure = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const [departments, setDepartments] = useState({ content: [], count: 0 });
    const activePageRef = useRef(0);
    const [activeDepartments, setActiveDepartments] = useState([]);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments?active=0&from=0', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setDepartments({ content: respJ, count: totalCount })
            })
            .catch(ex => console.log(ex))
    }, [token]);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setActiveDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [token])
    const updateList = (page) => {
        fetch('http://172.16.3.101:54321/api/departments?active=0&from=' + page, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
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
                        <th>Ad</th>
                        <th>Tabe olduğu struktur</th>
                        <th>Tip</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <NewStructureRow
                        token={token}
                        updateList={updateList}
                        activePageRef={activePageRef}
                        activeDepartments={activeDepartments}
                        setActiveDepartments={setActiveDepartments}
                        departments={departments.content}
                    />
                    {
                        departments.content.map(department =>
                            <TableRow
                                key={department.id}
                                setActiveDepartments={setActiveDepartments}
                                token={token}
                                activeDepartments={activeDepartments}
                                structure={department}
                                departments={departments}
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
    const { token, activeDepartments, setActiveDepartments, updateList, activePageRef } = props;
    const [newStructureData, setNewStructureData] = useState({ name: '', parent_id: -1, type: 0 });
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewStructureData(prev => ({ ...prev, [name]: value }))
    }
    const addStructure = () => {
        const data = JSON.stringify(newStructureData);
        fetch('http://172.16.3.101:54321/api/new-structure', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => {
                if (resp.status === 200)
                   return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => {
                const id = respJ[0].id;
                setNewStructureData({ name: '', parent_id: -1 })
                setActiveDepartments(prev => [...prev, { ...newStructureData, id }]);
                updateList(activePageRef.current)
            })
            .catch(ex => console.log(ex))
    }
    return (
        <tr>
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
                </select>
            </td>
            <td></td>
            <td><IoMdAdd title="yeni struktur əlavə et" onClick={addStructure} color="#f8942a" /></td>
        </tr>
    )
}
const TableRow = (props) => {
    // const departments = props.departments;
    const activeDepartments = props.activeDepartments;
    const setActiveDepartments = props.setActiveDepartments;
    const structure = props.structure;
    const [disabled, setDisabled] = useState(true);
    const [structureData, setStructureData] = useState(structure);
    const id = structure.id;
    useEffect(() => {
        setActiveDepartments(prev => prev.map(dep => dep.id === id ? structureData : dep))
    }, [structureData, id, setActiveDepartments])
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
        const data = JSON.stringify({ ...structureData, id: structure.id })
        fetch('http://172.16.3.101:54321/api/update-structure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + props.token
            },
            body: data
        })
            .then(resp => {
                if (resp.status === 200)
                   return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(_ => {
                setDisabled(true);
            })
            .catch(ex => console.log(ex));
    }
    const updateFunc = (id, stat) => {
        const data = JSON.stringify({ ...structureData, id, active: stat })
        fetch('http://172.16.3.101:54321/api/update-structure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + props.token
            },
            body: data
        })
            .then(resp => {
                if (resp.status === 200)
                    return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => { console.log(respJ) })
            .catch(ex => console.log(ex))
    }
    console.log(structureData)
    return (
        <tr className="structure-row" key={structure.id}>
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