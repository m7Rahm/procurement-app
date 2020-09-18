import React, { useState, useEffect } from 'react'
import {
    IoMdClose,
} from 'react-icons/io'
import {
    MdModeEdit
} from 'react-icons/md'
import {
    FaPlus
} from 'react-icons/fa'
import { token } from '../../data/data'
const NewCategory = (props) => {
    const closeModal = () => props.setSysParamsModalState(false);
    const [departments, setDepartments] = useState([]);
    const [newCatState, setNewCatState] = useState({ catName: '', department: 1 })
    const handleAddNewCategory = () => {
        const data = newCatState;
        fetch('http://172.16.3.101:54321/api/add-new-cat', {
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
                    props.setMaterials(prev => [...prev,
                    {
                        id: respJ[0].row_id,
                        user: 'Default Rahman',
                        product_title: newCatState.catName,
                        department_id: newCatState.department
                    }
                    ])
                    props.setSysParamsModalState(false);
                }
            })
            .catch(ex => console.log(ex))
    }
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex))
    }, []);
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        console.log(newCatState);
        setNewCatState(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div className="sys-param-modal">
            <div><IoMdClose size="18" onClick={closeModal} /></div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Kateqoriya</th>
                            <th>Yöndərilən şöbə</th>
                            <th>Istifadəçi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td><input type="text" name="catName" value={newCatState.catName} onChange={handleChange} /></td>
                            <td>
                                <select onChange={handleChange} name="department" value={newCatState.department}>
                                    {
                                        departments.map(department =>
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>blah blah blah</td>
                            <td><FaPlus onClick={handleAddNewCategory} cursor="pointer" /></td>
                        </tr>
                        {
                            props.materials.map((material, index) =>
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