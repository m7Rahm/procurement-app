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
import {
    MdEdit,
    MdAdd,
} from 'react-icons/md'
import StatusButton from '../../components/StatusButton'
const StrTypeRow = (props) => {
    const [disabled, setDisabled] = useState(true);
    const [type, setType] = useState(props.type);
    const handleEdit = () => {
        setDisabled(prev => !prev)
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setType(prev => ({ ...prev, [name]: value }))
    }
    const handleCancel = () => {
        setType(props.type);
        setDisabled(prev => !prev)
    }
    const handleDone = () => {
        fetch('http://172.16.3.101:54321/api/update-structure-type', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        .then(resp => resp.json())
        .then(respJ => {
            props.setStructureTypes(respJ)
        })
    }
    return (
        <li>
            <input disabled={disabled} name="name" value={type.name} onChange={handleChange} />
            <div style={{ paddingRight: '10px' }}>
                {
                    disabled
                        ? <MdEdit onClick={handleEdit} />
                        : <>
                            <IoMdClose color="#ff4a4a" onClick={handleCancel} />
                            <IoMdDoneAll color="#0F9D58" onClick={handleDone} />
                        </>
                }
            </div>
        </li>
    )
}
const StructureTypes = (props) => {
    const types = props.types;
    const token = props.token;
    const newStructureNameRef = useRef(null)
    const addNewStrType = () => {
        const data = { name: newStructureNameRef.current.value }
        fetch('http://172.16.3.101:54321/api/add-structure-type', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    const id = respJ[0].id;
                    props.setStructureTypes(prev => [...prev, { name: data.name, id }])
                }
            })
            .catch(ex => console.log(ex))
    }
    return (
        <ul className="structure-types">
            <li>
                <div>Tip</div>
                <div></div>
            </li>
            {
                types.map(type =>
                    <StrTypeRow token={token} setStructureTypes={props.setStructureTypes} key={type.id} type={type} />
                )
            }
            <li>
                <input ref={newStructureNameRef} placeholder="Ad.." />
                <div><MdAdd onClick={addNewStrType} /></div>
            </li>
        </ul>
    )
}
const TableRow = (props) => {
    const departments = props.departments;
    const structure = props.structure;
    const structureTypes = props.structureTypes;
    const [disabled, setDisabled] = useState(true);
    const [structureData, setStructureData] = useState({
        name: structure.name,
        type: structure.type,
        dependent_id: structure.dependent_id,
        active_passive: structure.active_passive
    })
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
        fetch('http://172.16.3.101:54321/api/update-structure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                props.setDepartments(respJ);
                setDisabled(true);
            })
            .catch(ex => console.log(ex));
    }
    const updateFunc = (id, stat) => {
        const data = { ...structureData, id, active: stat }
        fetch('http://172.16.3.101:54321/api/update-structure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => { console.log(respJ) })
            .catch(ex => console.log(ex))
    }
    return (
        <tr className="structure-row" key={structure.id}>
            <td>
                <input disabled={disabled} name="name" value={structureData.name} onChange={handleChange} />
            </td>
            <td>
                <select disabled={disabled} value={structureData.type} name="type" onChange={handleChange}>
                    {
                        structureTypes.map(type =>
                            <option value={type.id} key={type.id}>{type.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select name="dependent_id" onChange={handleChange} disabled={disabled} value={structureData.dependent_id || ''}>
                    {
                        departments.map(department =>
                            <option value={department.id} key={department.id}>{department.name}</option>
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
const Structure = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const [newStructureData, setNewStructureData] = useState({ name: '', dependent_id: 1, type: 1 });
    const [structureTypes, setStructureTypes] = useState([])
    const [departments, setDepartments] = useState([]);
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
        .then(resp => resp.json())
        .then(respJ => setDepartments(respJ))
        .catch(ex => console.log(ex))
    }
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments?active=0', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex))
        fetch('http://172.16.3.101:54321/api/structure-types?', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setStructureTypes(respJ))
    }, [token]);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewStructureData(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div className="users-page structure-page">
            <StructureTypes setStructureTypes={setStructureTypes} token={token} types={structureTypes} />
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Ad</th>
                        <th>Strukturun növü</th>
                        <th>Tabe olduğu struktur</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input value={newStructureData.name} name="name" onChange={handleChange} /></td>
                        <td>
                            <select name="type" value={newStructureData.type} onChange={handleChange}>
                                {
                                    structureTypes.map(type =>
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    )
                                }
                            </select>
                        </td>
                        <td>
                            <select name="dependent_id" value={newStructureData.dependent_id} onChange={handleChange}>
                                {
                                    departments.filter(department => department.active_passive === 1).map(department =>
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
                    {
                        departments.map(department =>
                            <TableRow
                                key={department.id}
                                setDepartments={setDepartments}
                                token={token}
                                structure={department}
                                departments={departments}
                                structureTypes={structureTypes}
                            />
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
export default Structure