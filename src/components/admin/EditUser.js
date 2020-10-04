import React, { useEffect, useState, useRef } from 'react'
import {
    FaLock,
    FaUnlock
} from 'react-icons/fa'
import {
    IoMdCheckmarkCircle
} from 'react-icons/io'
const EditUser = (props) => {
    const [userData, setUserData] = useState({ available_menus: '' });
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isProtected, setIsProtected] = useState(true);
    const [resetPasswordVisibility, setResetPasswordVisibility] = useState(false);
    const [password, setPassword] = useState('');
    const [showAlertModal, setShowAlertModal] = useState(false);
    const repeatPass = useRef(null);
    const availableMenus = userData.available_menus.split(',');
    const handleRoleChange = (e) => {
        const value = e.target.value;
        const availableMenus = roles.find(role => role.id.toString() === value).available_menus;
        setUserData(prev => ({...prev, role_id: value, available_menus: availableMenus }))
    }
    const updateUserData = () => {
        const data = {
            username: userData.username,
            fullName: userData.full_name,
            email: userData.email,
            passportData: userData.passport_data,
            fin: userData.vesiqe_fin_kod,
            structureid: userData.structure_dependency_id,
            role: userData.role_id,
            id: props.id
        }
        fetch('http://172.16.3.101:54321/api/update-user-data', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success')
                    props.closeModal()
            })
    }
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/departments`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
        fetch(`http://172.16.3.101:54321/api/roles`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => resp.json())
            .then(respJ => setRoles(respJ))
            .catch(ex => console.log(ex));
        fetch(`http://172.16.3.101:54321/api/user/${props.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => resp.json())
            .then(respJ => setUserData(respJ[0]))
            .catch(ex => console.log(ex))
    }, [props.id])
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserData(prev => ({ ...prev, [name]: value }));
    }
    const handleProtectionChange = () => {
        setIsProtected(prev => !prev);
    }
    const handlePasswordReset = () => {
        setResetPasswordVisibility(true)
    }
    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password)
    }
    const changePassword = () => {
        if (password === repeatPass.current.value) {
            const data = {
                password: password,
                id: props.id
            }
            fetch('http://172.16.3.101:54321/api/reset-password', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ[0].result === 'success')
                        setResetPasswordVisibility(false);
                    setShowAlertModal(true);
                })
                .catch(ex => console.log(ex))
        }
        else
            alert('Şifrəni təkrar yığan zaman səhvə yol vermisiniz')
    }
    return (
        <div className="edit-user">
            {
                isProtected
                    ? <FaLock onClick={handleProtectionChange} />
                    : <FaUnlock onClick={handleProtectionChange} />
            }
            <div>
                <h1>Şəxsi məlumatlar</h1>
                <div>
                    <div className="section-row">
                        <div>
                            <label>Ad, Soyad, Ata adı</label>
                            <input
                                disabled={isProtected}
                                value={userData.full_name || ''}
                                name="full_name"
                                onChange={handleChange}
                                style={{ width: '250px' }}
                            />
                        </div>
                        <div>
                            <label>ID</label>
                            <input disabled={isProtected} value={userData.passport_data || ''} name="passport_data" onChange={handleChange} />
                        </div>
                        <div>
                            <label>FIN</label>
                            <input disabled={isProtected} value={userData.vesiqe_fin_kod || ''} name="vesiqe_fin_kod" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="section-row">
                        <div>
                            <label>Email</label>
                            <input disabled={isProtected} value={userData.email || ''} name="email" onChange={handleChange} />
                        </div>
                        <div>
                            <label>Struktur</label>
                            <select
                                disabled={isProtected}
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
                            disabled={isProtected}
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
                        <input disabled={isProtected} value={userData.username || ''} name="username" onChange={handleChange} />
                        <div onClick={handlePasswordReset}>Şifrəni bərpa et</div>
                        {
                            resetPasswordVisibility &&
                            <>
                                <input
                                    placeholder="yeni şifrə"
                                    style={{ margin: '20px 0px' }}
                                    value={password}
                                    name="password"
                                    type="password"
                                    onChange={handlePasswordChange}
                                />
                                <input
                                    placeholder="şifrəni təkrar daxil edin"
                                    name="repeat-pass"
                                    ref={repeatPass}
                                    type="password"
                                />
                                <div onClick={changePassword}>Done</div>
                            </>
                        }
                    </div>
                </div>
                {
                    !isProtected &&
                    <div onClick={updateUserData} className="save-button">Yadda saxla</div>
                }
            </div>
            {
                showAlertModal &&
                <div className="operation-result">
                    <div>
                        <IoMdCheckmarkCircle size="88" />
                    </div>
                Əməliyyat uğurla tamamlandı
			</div>
            }
        </div >
    )
}
export default EditUser