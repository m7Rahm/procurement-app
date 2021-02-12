import React, { useState, useEffect, useContext } from 'react'
import StatusButton from '../../components/Misc/StatusButton'
import {
    MdEdit,
    MdAdd
} from 'react-icons/md'

import Modal from '../../components/Misc/Modal'
import UpdateRole from '../../components/Admin/UpdateRole'
import { TokenContext } from '../../App'
const Roles = (props) => {
    const tokenContext = useContext(TokenContext)
    const token = tokenContext[0].token;
    const [modal, setModal] = useState({ content: null, state: false })
    const [roles, setRoles] = useState([]);

    const handleRoleUpdate = (id) => {
        const role = id !== -1
            ? roles.find(role => role.id === id)
            : { id: -1, name: '', modules: '', previliges: '', active_passive: 1};
        const updateRole = (props) => <UpdateRole token={token} closeModal={changeModalState} setRoles={setRoles} {...props} role={role} />
        setModal({ content: updateRole, state: true })
    }
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/roles', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setRoles(respJ))
            .catch(ex => console.log(ex));
    }, [token]);
    const updateFunc = (id, state) => {
        const data = { ...roles.find(role => role.id === id), active_passive: state }
        fetch('http://192.168.0.182:54321/api/update-role', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .catch(ex => console.log(ex))
    }
    const changeModalState = () => setModal({ content: null, state: false })
    return (
        <div className="sys-params">
            <div>
                {
                    modal.state &&
                    <Modal changeModalState={changeModalState} width="300px">
                        {modal.content}
                    </Modal>
                }
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Modullar</th>
                            <th style={{ width: 'auto' }}>Yetkisi olduğu əməliyyatlar</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            roles.map((role, index) =>
                                <tr key={role.id}>
                                    <td>{index + 1}</td>
                                    <td>{role.name}</td>
                                    <td className="authorized-list">
                                        {
                                            role.modules.split(',').map((menu, index) =>
                                                <div key={index}>
                                                    {menu}
                                                </div>
                                            )
                                        }
                                    </td>
                                    <td className="authorized-list">
                                        {
                                            role.previliges.split(',').map((previlige, index) => {
                                                if (previlige === '')
                                                    return null;
                                                return (
                                                    <div key={index}>
                                                        {previlige}
                                                    </div>
                                                )
                                            })
                                        }
                                    </td>
                                    <td>
                                        <StatusButton
                                            id={role.id}
                                            status={role.active_passive}
                                            updateFunc={updateFunc}
                                        />
                                    </td>
                                    <td><MdEdit title="redaktə et" onClick={(e) => handleRoleUpdate(role.id)} /></td>
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
                            <td></td>
                            <td><MdAdd title="yeni rol yarat" style={{color: '#0495ce'}} size="26" onClick={(e) => handleRoleUpdate(-1)} /></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
export default Roles