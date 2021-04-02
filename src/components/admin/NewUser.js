import React, { useState, useEffect, useContext } from 'react'
import { TokenContext } from '../../App'
const NewUser = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [userData, setUserData] = useState({
        full_name: '',
        passport_data: '',
        vesiqe_fin_kod: '',
        structure_dependency_id: '-1',
        role_id: 1,
        email: '',
        username: '',
        password: '',
        position_id: '0',
    });
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => {
                if (resp.status === 200)
                    return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [token]);
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/roles', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => {
                if (resp.status === 200)
                    return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => setRoles(respJ))
            .catch(ex => console.log(ex));
    }, [token])
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setUserData(prev => ({ ...prev, [name]: value }))
    }
    const availableMenus = roles.length === 0 ? [] : roles.find(role => role.id === Number(userData.role_id)).modules.split(',');
    const addNewUser = () => {
        const data = userData;
        fetch('http://192.168.0.182:54321/api/add-new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
            .then(resp => {
                if (resp.status === 200)
                    return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    props.updateList(0);
                    props.closeModal();
                }
            })
    }
    const handleRoleChange = (e) => {
        const value = e.target.value;
        const availableMenus = roles.find(role => role.id.toString() === value).available_menus;
        setUserData(prev => ({ ...prev, available_menus: availableMenus, role_id: value }))
    }
    return (
        <div className="edit-user">
            <div>
                <h1>Şəxsi məlumatlar</h1>
                <div>
                    <div className="section-row">
                        <div>
                            <label>Ad, Soyad, Ata adı</label>
                            <input

                                value={userData.full_name}
                                name="full_name"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>ID</label>
                            <input value={userData.passport_data} name="passport_data" onChange={handleChange} />
                        </div>
                        <div>
                            <label>FIN</label>
                            <input value={userData.vesiqe_fin_kod} name="vesiqe_fin_kod" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="section-row">
                        <div>
                            <label>Email</label>
                            <input value={userData.email || ''} name="email" onChange={handleChange} />
                        </div>
                        <div>
                            <label>Stat</label>
                            <select
                                value={userData.position_id}
                                name="position_id"
                                onChange={handleChange}
                            >
                                <option value="0">Işçi</option>
                                <option value="1">Rəis</option>
                            </select>
                        </div>
                    </div>
                    <div className="section-row">
                        <div>
                            <label>Struktur</label>
                            <select
                                value={userData.structure_dependency_id || ''}
                                name="structure_dependency_id"
                                onChange={handleChange}
                            >
                                <option value="-1">-</option>
                                {
                                    departments.map(department =>
                                        <option value={department.id} key={department.id}>{department.name}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1>Yetkilər</h1>
                <div>
                    <div>
                        <label>Status</label>
                        <select
                            value={userData.role_id || ''}
                            onChange={handleRoleChange}
                        >
                            {
                                roles.map(role =>
                                    <option value={role.id} key={role.id}>{role.name}</option>
                                )
                            }
                        </select>
                    </div>
                    <div>
                        <label>Yektisi olduğu menular</label>
                        <ul>
                            {
                                availableMenus.map(menu =>
                                    <li className="menu-item" key={menu}>{menu}</li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <h1>Təhlükəsizlik</h1>
                <div>
                    <div className="security">
                        <input value={userData.username} placeholder="username" name="username" onChange={handleChange} />
                        <input value={userData.password} placeholder="password" type="password" name="password" onChange={handleChange} />
                        <div onClick={addNewUser}>Tamamla</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewUser