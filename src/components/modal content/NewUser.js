import React, { useState, useEffect } from 'react'

const NewUser = (props) => {
    const [userData, setUserData] = useState({full_name: '', passport_data: '', vesiqe_fin_kod: '', structure_dependency_id: 1, role_id: 1, email: '' });
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    // console.log(userData);
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
        fetch('http://172.16.3.101:54321/api/roles', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setRoles(respJ))
            .catch(ex => console.log(ex));
    }, []);
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setUserData(prev => ({ ...prev, [name]: value }))
    }
    const availableMenus = !userData.available_menus ? [] : userData.available_menus.split(',');
    const addNewUser = () => {
        const data = userData;
        fetch('http://172.16.3.101:54321/api/add-new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
    }
    const handleRoleChange = (e) => {
        const value = e.target.value;
        const availableMenus = roles.find(role => role.id.toString() === value).available_menus;
        setUserData(prev => ({...prev, available_menus: availableMenus, role_id: value }))
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
                                style={{ width: '250px' }}
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
                            <label>Struktur</label>
                            <select
                                value={userData.structure_dependency_id || ''}
                                name="structure_dependency_id"
                                onChange={handleChange}
                            >
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
                        <input value={userData.password} placeholder="password" name="password" onChange={handleChange} />
                        <div onClick={addNewUser}>Tamamla</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewUser